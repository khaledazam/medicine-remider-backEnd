

module.exports.home = function(req, res){
    return res.status(200).json({
        message: 'connection to backend is successfull',
        jwtToken: process.env.JWT_SECRET
    });
}