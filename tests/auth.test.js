// // test/user.test.js
// import * as chai from 'chai';
// import chaiHttp from 'chai-http';
// import sinon from 'sinon';
// import bcryptjs from 'bcryptjs';
// import { test, uploadImage, updateUser, deleteUser, getUserListings, getUser, getMe } from '../controllers/user_controller.js'; // Adjust path
// import User from '../model/user_model.js';
// import Listing from '../model/listing_model.js';
// import Comment from '../model/comment_model.js';
// import { errorHandler } from '../utils/error.js';
// import asyncHandler from '../utils/async.js';

// chai.use(chaiHttp);
// const expect = chai.expect;

// describe('User Controller Tests', () => {
//   let req, res, next;

//   beforeEach(() => {
//     req = { params: {}, body: {}, user: {} };
//     res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub(),
//       clearCookie: sinon.stub(),
//       send: sinon.stub(),
//     };
//     next = sinon.stub();
//   });


//   describe('uploadImage', () => {
//     it('should return 400 when no file is uploaded', async () => {
//       req.file = null;
//       await uploadImage(req, res, next);
//       expect(res.status.calledWith(400)).to.be.true;
//       expect(res.send.calledWith({ message: 'Please upload a file' })).to.be.true;
//     });

//     it('should return 200 with filename when file is uploaded', async () => {
//       req.file = { filename: 'test.jpg' };
//       await uploadImage(req, res, next);
//       expect(res.status.calledWith(200)).to.be.true;
//       expect(res.json.calledWith({ success: true, data: 'test.jpg' })).to.be.true;
//     });
//   });

//   describe('updateUser', () => {
//     it('should return 401 if user id does not match', async () => {
//       req.user.id = 'user1';
//       req.params.id = 'user2';
//       await updateUser(req, res, next);
//       expect(next.calledOnce).to.be.true;
//       expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
//     });

//     it('should update user successfully', async () => {
//       req.user.id = 'user1';
//       req.params.id = 'user1';
//       req.body = { username: 'newuser', email: 'new@example.com', password: 'password123' };
//       const mockUpdatedUser = { _doc: { username: 'newuser', email: 'new@example.com', _id: 'user1' } };
//       sinon.stub(User, 'findByIdAndUpdate').resolves(mockUpdatedUser);
//       sinon.stub(bcryptjs, 'hashSync').returns('hashedPassword');

//       await updateUser(req, res, next);

//       expect(res.status.calledWith(200)).to.be.true;
//       expect(res.json.calledWith({ username: 'newuser', email: 'new@example.com', _id: 'user1' })).to.be.true;
//       User.findByIdAndUpdate.restore();
//       bcryptjs.hashSync.restore();
//     });
//   });

//   describe('deleteUser', () => {
//     it('should return 401 if user id does not match', async () => {
//       req.user.id = 'user1';
//       req.params.id = 'user2';
//       await deleteUser(req, res, next);
//       expect(next.calledOnce).to.be.true;
//       expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
//     });

//     it('should delete user successfully', async () => {
//       req.user.id = 'user1';
//       req.params.id = 'user1';
//       sinon.stub(User, 'findByIdAndDelete').resolves();

//       await deleteUser(req, res, next);

//       expect(res.status.calledWith(200)).to.be.true;
//       expect(res.json.calledWith('User has been deleted!')).to.be.true;
//       expect(res.clearCookie.calledWith('access_token')).to.be.true;
//       User.findByIdAndDelete.restore();
//     });
//   });

//   describe('getUserListings', () => {
//     it('should return 401 if user id does not match', async () => {
//       req.user.id = 'user1';
//       req.params.id = 'user2';
//       await getUserListings(req, res, next);
//       expect(next.calledOnce).to.be.true;
//       expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
//     });
//     it('should return list of listings', async () => {
//         req.user.id = 'user1';
//         req.params.id = 'user1';
//         const mockListings = [{title:'Listing 1'},{title:'Listing 2'}];
//         sinon.stub(Listing, 'find').resolves(mockListings);

//         await getUserListings(req,res,next);

//         expect(res.status.calledWith(200)).to.be.true;
//         expect(res.json.calledWith(mockListings)).to.be.true;
//         Listing.find.restore();
//     });
//   });

//     describe('getUser', () => {
//         it('should return user data with listings and comments count', async () => {
//             req.params.id = 'user1';
//             const mockUser = {_doc: {username:'testUser', email:'test@example.com', _id:'user1'}};
//             sinon.stub(User, 'findById').resolves(mockUser);
//             sinon.stub(Listing, 'countDocuments').resolves(2);
//             sinon.stub(Comment, 'countDocuments').resolves(3);

//             await getUser(req,res,next);

//             expect(res.status.calledWith(200)).to.be.true;
//             expect(res.json.calledWith({username:'testUser', email:'test@example.com', _id:'user1', listingsCount:2, commentsCount:3})).to.be.true;
//             User.findById.restore();
//             Listing.countDocuments.restore();
//             Comment.countDocuments.restore();
//         });
//     });


// });