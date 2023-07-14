import User from "./userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

// User authentication controller - returns an Authorization token and welcome message
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

// User profile retrieval controller - returns user information with valid token
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

// User profile update controller - returns updated user information with valid token and valid request payload
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

		return res.status(200).json({ message: "User profile updated successfully", updatedUser: user });
	} catch (error) {
		console.error("Error updating user profile:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export default { registerUser, authenticateUser, getProfile, updateProfile };