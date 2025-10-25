const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authenticate } = require("../middleware/auth"); // FIXED: Remove destructuring
const mongoose = require("mongoose");
const { Schema } = mongoose;
const admin = require("../firebaseAdmin"); // Your firebase admin init file
const crypto = require("crypto");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("contact")
      .optional()
      .matches(/^[0-9]{10}$/)
      .withMessage("Contact must be a 10-digit number"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { name, email, password, contact, dob } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already exists with this email" });
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
        contact,
        dob,
      });

      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          contact: user.contact,
          dob: user.dob,
        },
      });
    } catch (error) {
      // console.error('Registration error:', error);
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user and include password
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(403).json({ message: "Account is deactivated" });
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token
      const token = generateToken(user._id);

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          contact: user.contact,
          dob: user.dob,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// @route   POST /api/auth/google
// @desc    Google OAuth login/register
// @access  Public
router.post(
  "/google",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("name").notEmpty().withMessage("Name is required"),
    body("googleId").notEmpty().withMessage("Google ID is required"),
    body("idToken").notEmpty().withMessage("Firebase ID token is required"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { email, name, googleId, profilePicture, idToken } = req.body;

      console.log("🧩 Received Google sign-in body:", req.body);
      // Verify Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log("✅ Decoded Firebase token:", decodedToken);
      if (decodedToken.email !== email) {
        return res.status(401).json({ message: "Invalid Firebase ID token" });
      }

      // Check if user exists
      let user = await User.findOne({ email });

      if (!user) {
        // Create new user
        const randomPassword = require("crypto")
          .randomBytes(32)
          .toString("hex");
        user = new User({
          name,
          email,
          googleId,
          profilePicture,
          password: randomPassword, // Random password for OAuth users
        });
        await user.save();
      } else {
        // Update existing user with Google info
        user.googleId = googleId;
        if (profilePicture) user.profilePicture = profilePicture;
        user.lastLogin = new Date();
        await user.save();
      }

      // Generate token
      const token = generateToken(user._id);

      res.json({
        message: "Google authentication successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          contact: user.contact,
          role: user.role,
          profilePicture: user.profilePicture,
        },
        token,
      });
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", authenticate, async (req, res) => {
  try {
    console.log("📥 GET /api/auth/me - User ID:", req.userId);

    // Use req.userId (set by authenticate middleware)
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        dob: user.dob,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route PUT /api/auth/me
// @desc Update current user profile
// @access Private
router.put("/me", authenticate, async (req, res) => {
  try {
    console.log("📝 PUT /me - userId:", req.userId);
    console.log("📦 Body:", req.body);

    // FIXED: Use req.userId instead of req.user._id
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only editable fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.contact) user.contact = req.body.contact;
    if (req.body.dob) {
      const parsedDate = new Date(req.body.dob);
      if (!isNaN(parsedDate)) {
        user.dob = parsedDate.toISOString().split("T")[0];
      }
    }

    // Save updated user
    const updatedUser = await user.save();

    console.log("✅ Profile updated successfully");

    // Return updated user data
    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        contact: updatedUser.contact,
        dob: updatedUser.dob,
      },
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post("/logout", authenticate, (req, res) => {
  // In a JWT-based system, logout is handled client-side
  // This endpoint can be used for logging or cleanup
  res.json({ message: "Logged out successfully" });
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post(
  "/forgot-password",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "No account found with this email" });
      }

      // Generate reset token (implement email sending logic)
      const resetToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
      await user.save();

      // TODO: Send email with reset link
      // For now, return the token (remove in production)
      res.json({
        message: "Password reset email sent",
        resetToken, // Remove this in production
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    handleValidationErrors,
  ],
  async (req, res) => {
    try {
      const { token, password } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid or expired reset token" });
      }

      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.json({ message: "Password reset successful" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

module.exports = router;
