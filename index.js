const express = require("express");
const app = express();
const mongoose = require("mongoose"); 
const bodyParser = require("body-parser");
const path = require("path");
const User = require("./models/chat.js");
const methodOverride = require("method-override");
const session = require("express-session");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        secret: "your-secret-key", 
        resave: false,
        saveUninitialized: true,
    })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

main()
    .then(() => console.log("Connection successful"))
    .catch((err) => console.error("Database connection error:", err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/toh");
}

// Route for Login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ Username: username });

        if (!user) {
            return res.status(401).send(
                "<script>alert('User not found! Please register.'); window.location.href = '/register';</script>"
            );
        }

        if (password === user.Password) {
            req.session.user = {
                _id: user._id.toString(),
                FirstName: user.FirstName,
                LastName: user.LastName,
                Location: user.Location,
                Donations: user.Donations,
                Rewards: user.Rewards,
                Story: user.Story,
            };

            return res.status(200).send(`<script>window.location.href = '/dashboard';</script>`);
        } else {
            return res.status(401).send(
                "<script>alert('Incorrect password! Please try again.'); window.location.href = '/login';</script>"
            );
        }
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).send(
            "<script>alert('An error occurred during login. Please try again later.'); window.location.href = '/login';</script>"
        );
    }
});

// Dashboard route
app.get("/dashboard", async (req, res) => {
    if (req.session.user) {
        const { FirstName, LastName, Location, Donations, Rewards, Story } = req.session.user;
        res.render("dashboard.ejs", { FirstName, LastName, Location, Donations, Rewards, Story });
    } else {
        res.redirect("/login");
    }
});

// Logout route
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error during logout:", err);
            return res.status(500).send("An error occurred during logout.");
        }
        res.redirect("/login");
    });
});

// Registration route
app.post("/register", async (req, res) => {
    const { username, password, firstName, lastName } = req.body;

    try {
        const existingUser = await User.findOne({ Username: username });
        if (existingUser) {
            return res.status(400).send(
                "<script>alert('User already exists! Please login instead.'); window.location.href = '/login';</script>"
            );
        }

        const newUser = new User({
            Username: username,
            Password: password,
            FirstName: firstName || "",
            LastName: lastName || "",
            Location: "",
            Donations: 0,
            Rewards: 0,
            Story: "",
        });

        const savedUser = await newUser.save();

        req.session.user = {
            _id: savedUser._id.toString(),
            FirstName: savedUser.FirstName,
            LastName: savedUser.LastName,
            Location: savedUser.Location,
            Donations: savedUser.Donations,
            Rewards: savedUser.Rewards,
            Story: savedUser.Story,
        };

        return res.status(201).redirect("/dashboard");
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).send(
            "<script>alert('An error occurred during registration. Please try again later.'); window.location.href = '/register';</script>"
        );
    }
});

// Update Story Route
app.post("/dashboard/story", async (req, res) => {
    const { story } = req.body;

    if (!req.session.user) {
        console.error("No session found.");
        return res.redirect("/login");
    }

    try {
        const userId = req.session.user._id;

        console.log("Updating story for user ID:", userId); 
        console.log("Story content:", story); 

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { Story: story },
            { new: true }
        );

        if (!updatedUser) {
            console.error("User not found for ID:", userId);
            return res.status(404).send("User not found.");
        }

        console.log("Story updated successfully:", updatedUser); 
        req.session.user.Story = updatedUser.Story;

        return res.send(
            "<script>alert('Your story has been updated successfully!'); window.location.href = '/dashboard';</script>"
        );
    } catch (error) {
        console.error("Error updating story:", error);
        return res.status(500).send(
            "<script>alert('An error occurred while updating your story. Please try again later.'); window.location.href = '/dashboard';</script>"
        );
    }
});

// Donate Now Route
app.get("/donate", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    res.render("donate.ejs", { user: req.session.user });
});

app.post("/donate", async (req, res) => {
    const { clothType, numberOfClothes, pickUpAddress } = req.body;

    if (!req.session.user) {
        return res.redirect("/login");
    }

    try {
        const userId = req.session.user._id;

        const updatedUser = await User.findById(userId);

        if (!updatedUser) {
            return res.status(404).send("User not found.");
        }

        updatedUser.Donations += 1;

        if (updatedUser.Donations % 2 === 0) {
            updatedUser.Rewards += 1; 
        }

        updatedUser.Location = pickUpAddress;

        await updatedUser.save();

        req.session.user.Donations = updatedUser.Donations;
        req.session.user.Rewards = updatedUser.Rewards;
        req.session.user.Location = updatedUser.Location;

        res.send(
            `<script>
                alert('Thank you for your donation! A delivery fee of ₹50 has been processed.');
                window.location.href = '/dashboard';
            </script>`
        );
    } catch (error) {
        console.error("Error processing donation:", error);
        res.status(500).send(
            `<script>
                alert('An error occurred. Please try again.');
                window.location.href = '/donate';
            </script>`
        );
    }
});


app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

// Start Server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});