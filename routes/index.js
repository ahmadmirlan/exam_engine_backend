const homeRouter = require('./home');
const usersRouter = require('./users');
const authRouter = require('./AuthRouter');
const categoryAuth = require('./CategoryRouter');
const subCategoryAuth = require('./SubCategoryRouter');

module.exports = (app) => {
    app.use('/', homeRouter);
    app.use('/auth', authRouter);
    app.use('/api/categories', categoryAuth);
    app.use('/api/sub/categories', subCategoryAuth);1111
};