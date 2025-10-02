function validateUser(data) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/;
    if (!passwordRegex.test(data.password)) throw new Error("INVALID PASSWORD FORMAT");
}

module.exports = { validateUser };