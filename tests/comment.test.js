// // test/comment.test.js
// import * as chai from 'chai';
// import sinon from 'sinon';
// import { addComment, getComments, deleteComment, getallcomments, getMobComments, getMobComment, createMobComment, updateMobComment, deleteMobComment } from '../controllers/comment_controller.js'; // Adjust path
// import Comment from '../model/comment_model.js';
// import Listing from '../model/listing_model.js';
// import { errorHandler } from '../utils/error.js';

// const expect = chai.expect;

// describe('Comment Controller Tests', () => {
//   let req, res, next;

//   beforeEach(() => {
//     req = { params: {}, body: {}, query: {}, user: {} };
//     res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub(),
//     };
//     next = sinon.stub();
//   });

//   describe('addComment', () => {
//     it('should return 404 if listing is not found', async () => {
//       req.params.id = 'listing1';
//       sinon.stub(Listing, 'findById').resolves(null);

//       await addComment(req, res, next);

//       expect(next.calledOnce).to.be.true;
//       expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
//       Listing.findById.restore();
//     });

//     it('should create a comment successfully', async () => {
//       req.params.id = 'listing1';
//       req.user.id = 'user1';
//       req.body = { comment: 'Test Comment' };
//       const mockListing = { _id: 'listing1' };
//       const mockComment = { listing: 'listing1', user: 'user1', comment: 'Test Comment' };
//       sinon.stub(Listing, 'findById').resolves(mockListing);
//       sinon.stub(Comment, 'create').resolves(mockComment);

//       await addComment(req, res, next);

//       expect(res.status.calledWith(201)).to.be.true;
//       expect(res.json.calledWith(mockComment)).to.be.true;
//       Listing.findById.restore();
//       Comment.create.restore();
//     });
//   });



//   describe('deleteComment', () => {
//     it('should return 404 if comment is not found', async () => {
//       req.params.id = 'comment1';
//       sinon.stub(Comment, 'findById').resolves(null);

//       await deleteComment(req, res, next);

//       expect(next.calledOnce).to.be.true;
//       expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
//       Comment.findById.restore();
//     });

//     it('should delete comment successfully as admin', async () => {
//       req.params.id = 'comment1';
//       req.user.isAdmin = true;
//       const mockComment = { user: 'user2' };
//       sinon.stub(Comment, 'findById').resolves(mockComment);
//       sinon.stub(Comment, 'findByIdAndDelete').resolves();

//       await deleteComment(req, res, next);

//       expect(res.status.calledWith(200)).to.be.true;
//       expect(res.json.calledWith('Comment has been deleted!')).to.be.true;
//       Comment.findById.restore();
//       Comment.findByIdAndDelete.restore();
//     });

//     it('should delete comment successfully as user', async () => {
//       req.params.id = 'comment1';
//       req.user.id = 'user1';
//       const mockComment = { user: 'user1' };
//       sinon.stub(Comment, 'findById').resolves(mockComment);
//       sinon.stub(Comment, 'findByIdAndDelete').resolves();

//       await deleteComment(req, res, next);

//       expect(res.status.calledWith(200)).to.be.true;
//       expect(res.json.calledWith({ message: 'Comment has been deleted!' })).to.be.true;
//       Comment.findById.restore();
//       Comment.findByIdAndDelete.restore();
//     });

//     it('should return 401 if user is not authorized', async () => {
//       req.params.id = 'comment1';
//       req.user.id = 'user1';
//       const mockComment = { user: 'user2' };
//       sinon.stub(Comment, 'findById').resolves(mockComment);

//       await deleteComment(req, res, next);

//       expect(next.calledOnce).to.be.true;
//       expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
//       Comment.findById.restore();
//     });
//   });

// });