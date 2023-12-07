const { validateComment } = require('../../middleware/commentValidator.js');
const httpMocks = require('node-mocks-http');
describe('Comment Validation Middleware', () => {
    let req, res, next;
    
    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    it('should call next() for valid comment', () => {
        req.body = { author: 'John Doe', text: 'This is a valid comment.' };
        validateComment(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should return 500 for invalid comment', () => {
        req.body = { author: 'John Doe' };
        validateComment(req, res, next);
        expect(res.statusCode).toBe(500);
    });


});
