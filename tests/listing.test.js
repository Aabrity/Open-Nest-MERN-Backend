// // test/listing.test.js
// import * as chai from 'chai';
// import sinon from 'sinon';
// import { createListing, deleteListing, updateListing, getListing, getListings, getListingNumber, getMobListings, getMobListing, createMobListing, updateMobListing, deleteMobListing } from '../controllers/listing_controller.js'; // Adjust path
// import Listing from '../model/listing_model.js';
// import Like from '../model/like_model.js';
// import { errorHandler } from '../utils/error.js';

// const expect = chai.expect;

// describe('Listing Controller Tests', () => {
//   let req, res, next;

//   beforeEach(() => {
//     req = { params: {}, body: {}, query: {}, user: {} };
//     res = {
//       status: sinon.stub().returnsThis(),
//       json: sinon.stub(),
//     };
//     next = sinon.stub();
//   });

//   describe('createListing', () => {
//     it('should return 400 if imageUrls are missing', async () => {
//       req.body = {};
//       await createListing(req, res, next);
//       expect(next.calledOnce).to.be.true;
//       expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
//     });

//     it('should create a listing successfully', async () => {
//       req.body = { name: 'Test Listing', imageUrls: ['url1', 'url2'], userRef: 'user1' };
//       const mockListing = { name: 'Test Listing', imageUrls: ['url1', 'url2'], userRef: 'user1' };
//       sinon.stub(Listing, 'create').resolves(mockListing);

//       await createListing(req, res, next);

//       expect(res.status.calledWith(201)).to.be.true;
//       expect(res.json.calledWith(mockListing)).to.be.true;
//       Listing.create.restore();
//     });
//   });

//   describe('deleteListing', () => {
//     it('should return 404 if listing is not found', async () => {
//       req.params.id = 'listing1';
//       sinon.stub(Listing, 'findById').resolves(null);

//       await deleteListing(req, res, next);

//       expect(next.calledOnce).to.be.true;
//       expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
//       Listing.findById.restore();
//     });

//     it('should delete listing successfully as admin', async () => {
//       req.params.id = 'listing1';
//       req.user.isAdmin = true;
//       const mockListing = { userRef: 'user2' };
//       sinon.stub(Listing, 'findById').resolves(mockListing);
//       sinon.stub(Listing, 'findByIdAndDelete').resolves();

//       await deleteListing(req, res, next);

//       expect(res.status.calledWith(200)).to.be.true;
//       expect(res.json.calledWith('Listing has been deleted!')).to.be.true;
//       Listing.findById.restore();
//       Listing.findByIdAndDelete.restore();
//     });

//     it('should delete listing successfully as user', async () => {
//       req.params.id = 'listing1';
//       req.user.id = 'user1';
//       const mockListing = { userRef: 'user1' };
//       sinon.stub(Listing, 'findById').resolves(mockListing);
//       sinon.stub(Listing, 'findByIdAndDelete').resolves();

//       await deleteListing(req, res, next);

//       expect(res.status.calledWith(200)).to.be.true;
//       expect(res.json.calledWith('Listing has been deleted!')).to.be.true;
//       Listing.findById.restore();
//       Listing.findByIdAndDelete.restore();
//     });

//     it('should return 401 if user is not authorized', async () => {
//       req.params.id = 'listing1';
//       req.user.id = 'user1';
//       const mockListing = { userRef: 'user2' };
//       sinon.stub(Listing, 'findById').resolves(mockListing);

//       await deleteListing(req, res, next);

//       expect(next.calledOnce).to.be.true;
//       expect(next.calledWith(sinon.match.instanceOf(Error))).to.be.true;
//       Listing.findById.restore();
//     });
//   });

//   describe('updateListing', () => {
//     it('should update listing successfully', async () => {
//       req.params.id = 'listing1';
//       req.user.id = 'user1';
//       req.body = { name: 'Updated Listing' };
//       const mockListing = { userRef: 'user1' };
//       const mockUpdatedListing = { name: 'Updated Listing', userRef: 'user1' };
//       sinon.stub(Listing, 'findById').resolves(mockListing);
//       sinon.stub(Listing, 'findByIdAndUpdate').resolves(mockUpdatedListing);

//       await updateListing(req, res, next);

//       expect(res.status.calledWith(200)).to.be.true;
//       expect(res.json.calledWith(mockUpdatedListing)).to.be.true;
//       Listing.findById.restore();
//       Listing.findByIdAndUpdate.restore();
//     });
//   });

//   describe('getListing', () => {
//       it('should return listing with like count', async ()=>{
//           req.params.id = 'listing1';
//           const mockListing = {toObject: ()=>({name:'Listing 1'})};
//           sinon.stub(Listing, 'findById').resolves(mockListing);
//           sinon.stub(Like, 'countDocuments').resolves(5);

//           await getListing(req,res,next);

//           expect(res.status.calledWith(200)).to.be.true;
//           expect(res.json.calledWith({name:'Listing 1', likeCount:5})).to.be.true;
//           Listing.findById.restore();
//           Like.countDocuments.restore();
//       });
//   });


//      describe('getMobListing', () => {
//         it('should return mobile listing data by id', async () => {
//             req.params.id = 'listing1';
//             const mockListing = {name:'Listing 1'};
//             sinon.stub(Listing, 'findById').resolves(mockListing);
//             await getMobListing(req,res,next);
//             expect(res.status.calledWith(200)).to.be.true;
//             expect(res.json.called).to.be.true;
//             Listing.findById.restore();
//         });
//     });
// })