// // test/like.test.js
// import * as chai from 'chai';
// import sinon from 'sinon';
// import { likeListing, getLikesCount, getMobLikes, getMobListing, createMobLike, deleteMobLike, toggleMobLike } from '../controllers/like_controller.js'; // Adjust path
// import Like from '../model/like_model.js';
// import Listing from '../model/listing_model.js';
// import { errorHandler } from '../utils/error.js';

// const expect = chai.expect;

// describe('Like Controller Tests', () => {
//   let req, res, next;

//   beforeEach(() => {
//     req = { params: {}, body: {}, query: {}, user: {} };
//     res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub(),
//     };
//     next = sinon.stub();
//   });

//   describe('likeListing', () => {
//     it('should return 404 if listing is not found', async () => {
//       req.params.id = 'listing1';
//       sinon.stub(Listing, 'findById').resolves(null);

//       await likeListing(req, res, next);

//       expect(next.calledOnce).to.be.true;
//       expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
//       Listing.findById.restore();
//     });

//     it('should like a listing successfully', async () => {
//       req.params.id = 'listing1';
//       req.user.id = 'user1';
//       const mockListing = { _id: 'listing1', likesCount: 0, save: sinon.stub().resolves() };
//       const mockLike = { user: 'user1', listing: 'listing1' };
//       sinon.stub(Listing, 'findById').resolves(mockListing);
//       sinon.stub(Like, 'findOne').resolves(null);
//       sinon.stub(Like, 'create').resolves(mockLike);

//       await likeListing(req, res, next);

//       expect(res.status.calledWith(201)).to.be.true;
//       expect(res.json.calledWith({ message: 'Listing liked successfully', likesCount: 1 })).to.be.true;
//       Listing.findById.restore();
//       Like.findOne.restore();
//       Like.create.restore();
//     });

//     it('should unlike a listing successfully', async () => {
//       req.params.id = 'listing1';
//       req.user.id = 'user1';
//       const mockListing = { _id: 'listing1', likesCount: 1, save: sinon.stub().resolves() };
//       const mockLike = { _id: 'like1', user: 'user1', listing: 'listing1' };
//       sinon.stub(Listing, 'findById').resolves(mockListing);
//       sinon.stub(Like, 'findOne').resolves(mockLike);
//       sinon.stub(Like, 'findByIdAndDelete').resolves();

//       await likeListing(req, res, next);

//       expect(res.status.calledWith(200)).to.be.true;
//       expect(res.json.calledWith({ message: 'Listing unliked successfully', likesCount: 0 })).to.be.true;
//       Listing.findById.restore();
//       Like.findOne.restore();
//       Like.findByIdAndDelete.restore();
//     });
//   });

//   describe('getLikesCount', () => {
//     it('should get likes count for a listing', async () => {
//       req.params.id = 'listing1';
//       sinon.stub(Like, 'countDocuments').resolves(5);

//       await getLikesCount(req, res, next);

//       expect(res.status.calledWith(200)).to.be.true;
//       expect(res.json.calledWith({ likesCount: 5 })).to.be.true;
//       Like.countDocuments.restore();
//     });
//   });

//   describe('getMobLikes', () => {
//     it('should get all likes', async () => {
//       const mockLikes = [{ user: 'user1', listing: 'listing1' }];
//       sinon.stub(Like, 'find').resolves(mockLikes);

//       await getMobLikes(req, res, next);

//       expect(res.status.calledWith(200)).to.be.true;
//       expect(res.json.called).to.be.true;
//       Like.find.restore();
//     });
//   });

//   describe('getMobListing', () => {
//     it('should get a like by id', async () => {
//       req.params.id = 'like1';
//       const mockLike = { user: 'user1', listing: 'listing1' };
//       sinon.stub(Like, 'findById').resolves(mockLike);

//       await getMobListing(req, res, next);

//       expect(res.status.calledWith(200)).to.be.true;
//       expect(res.json.called).to.be.true;
//       Like.findById.restore();
//     });
//   });

//   describe('createMobLike', () => {
//     it('should create a like', async () => {
//       const mockLike = { user: 'user1', listing: 'listing1' };
//       sinon.stub(Like, 'create').resolves(mockLike);

//       await createMobLike(req, res, next);

//       expect(res.status.calledWith(201)).to.be.true;
//       expect(res.json.called).to.be.true;
//       Like.create.restore();
//     });
//   });

//   describe('deleteMobLike', () => {
//     it('should delete a like by id', async () => {
//       req.params.id = 'like1';
//       const mockLike = { user: 'user1', listing: 'listing1' };
//       sinon.stub(Like, 'findByIdAndDelete').resolves(mockLike);

//       await deleteMobLike(req, res, next);

//       expect(res.status.calledWith(200)).to.be.true;
//       expect(res.json.called).to.be.true;
//       Like.findByIdAndDelete.restore();
//     });
//   });
//     describe('toggleMobLike', () => {
//         it('should toggle a like', async () => {
//             req.body = {userId: 'user1', listingId: 'listing1'};
//             const mockLike = {_id:'like1', userId: 'user1', listingId: 'listing1'};
//             sinon.stub(Like, 'findOne').resolves(mockLike);
//             sinon.stub(Like, 'findByIdAndDelete').resolves(mockLike);

//             await toggleMobLike(req,res,next);

//             expect(res.status.calledWith(200)).to.be.true;
//             expect(res.json.called).to.be.true;
//             Like.findOne.restore();
//             Like.findByIdAndDelete.restore();
//         });
//     });
// });