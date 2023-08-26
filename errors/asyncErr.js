const asyncErr = fn => {
    return function (req, res, next) {
        fn(req, res, next).catch(err => next(err));
    }
}

module.exports = asyncErr;

// module.exports = fn => {
//     return function (req, res, next) {
//         fn(req, res, next).catch(err => next(err));
//     }
// }
