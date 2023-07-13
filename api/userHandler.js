import User from "userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		// validate payload and ensure no existing username or email in database
		const existingUser = await User.findOne({ $or: [{ username }, { email }] });
		if (existingUser) {
			return res
				.status(409)
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
		// await newUser.save();

		return res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		console.error("Error registering user:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

// User authentication controller
const authenticateUser = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Find the username or email
		const user = await User.findOne({ $or: [{ username }, { password }] });
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Compare the provided password with the stored hash
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		// Generate a JWT token !!! What is a secret key
		const token = jwt.sign({ userId: user._id }, "PrivateKey", {
			expiresIn: "3h",
		});

		return res.status(200).json({ token });
	} catch (error) {
		console.error("Error authenticating user:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

// User profile retrieval controller
const getProfile = async (req, res) => {
	try {
		// create middleware to verify the JWT and populate req.user with the authenticated user info

		// Retrieve the user profile from req.user
		const { username, email } = req.user;

		return res.status(200) / json({ username, email });
	} catch (error) {
		console.error("Error retrieving user profile:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

// User profile update controller
const updateProfile = async (req, res) => {
	try {
		// call JWT verification middleware

		const { username, email } = req.body;

		// Update the user profile in the database
		req.user.username = username;
		req.user.email = email;
		// await req.user.save();

		return res.status(200).json({ message: "User profile updated successfully" });
	} catch (error) {
		console.error("Error updating user profile:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

export default { registerUser, authenticateUser, getProfile, updateProfile };