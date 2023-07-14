import User from "./userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with the provided username, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user.
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User registration successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       400:
 *         description: Bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
const registerUser = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		console.log(req.body)

		// validate payload and ensure no existing username or email in database
		const existingUser = await User.findOne({ $or: [{ username }, { email }] });
		if (existingUser) {
			return res
				.status(400)
				.json({ error: "Username or email already in use" });
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create a new user
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
		});

		// Save the user to the database
		await newUser.save();

		return res.status(201).json({ message: `User ${username} registered successfully` });
	} catch (error) {
		if(error.name === 'ValidationError') {
			const validationErrors = Object.values(error.errors).map(err => err.message);
			return res.status(400).json({ error: validationErrors });
		}

		console.error("Error registering user:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * @swagger
 * /api/authenticate:
 *   post:
 *     summary: Authenticate user
 *     description: Authenticates a user with the provided username and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user.
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: User authentication successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated user.
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
const authenticateUser = async (req, res) => {
	try {
		const { username, password } = req.body;
		
		// Find the username or email
		const user = await User.findOne({ $or: [{ username }, { password }] });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		
		// Compare the provided password with the stored hash
		const isPasswordMatch = bcrypt.compareSync(password, user.password);
		if (!isPasswordMatch) {
			return res.status(401).json({ error: "Invalid credentials" });
		}
		
		// Generate a JWT token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "3h",
		});
		
		return res.status(200).json({ token, message: `Welcome back, ${user.username}!` });
	} catch (error) {
		console.error("Error authenticating user:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * @swagger
 * /api/profile/{id}:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the profile information of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user profile to be displayed.
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   description: The username of the user.
 *                 email:
 *                   type: string
 *                   description: The email of the user.
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
const getProfile = async (req, res) => {
	const userId = req.user.userId;

	try {
		const user = await User.findById(userId);
		console.log("user, userID", user, userId)

		const { username, email } = user;

		return res.status(200).json({ username, email });
	} catch (error) {
		console.error("Error retrieving user profile:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * @swagger
 * /api/profile/{id}/update:
 *   put:
 *     summary: Update user profile
 *     description: Updates the profile information of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user profile to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new username for the user.
 *               email:
 *                 type: string
 *                 description: The new email for the user.
 *               password:
 *                 type: string
 *                 description: The new password for the user.
 *     responses:
 *       200:
 *         description: User profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                 updatedUser:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       description: The updated username of the user.
 *                     email:
 *                       type: string
 *                       description: The updated email of the user.
 *                     password:
 *                       type: string
 *                       description: The updated password of the user.
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 */
const updateProfile = async (req, res) => {
	try {
		const userId = req.user.userId;
		const { username, email, password } = req.body;

		const user = await User.findById(userId);

		if (username) {
			user.username = username;
		}
		if (email) {
			user.email = email;
		}
		if (password) {
			const hashedPassword = await bcrypt.hash(password, 10);
			user.password = hashedPassword;
		}
		// Update the user profile in the database
		await user.save();

		return res.status(200).json({ message: "User profile updated successfully", updatedUser: {username: user.username, email: user.email, password} });
	} catch (error) {
		console.error("Error updating user profile:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export default { registerUser, authenticateUser, getProfile, updateProfile };