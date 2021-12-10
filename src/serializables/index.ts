import { serializablesAPI } from './serializablesAPI';

export { serializablesAPI };

// import { Transaction } from '@prisma/client';
// import express from 'express';
// import passport from 'passport';
// import { JWTData } from '../auth/utils';
// import { createResponse } from '../common/response';
// import prisma from '../config/database';

// const router = express.Router();

// /** Get all serializables if user is authenticated */
// router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
//   const serializables = await prisma.serializable.findMany();
//   res.json(createResponse({ data: serializables }));
// });

// /** Delete serializable if user is Admin */
// router.delete('/:id/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { role } = req.user as JWTData;
//     if (role !== 'ADMIN') {
//       return res
//         .status(401)
//         .json(createResponse({ error: 'You are not authorized to delete serializable items', status: 401 }));
//     }

//     const serializable = await prisma.serializable.delete({
//       where: {
//         id: id,
//       },
//     });
//     res.json(createResponse({ data: serializable }));
//   } catch (err) {
//     next(err);
//   }
// });

// /** Get specific serializable */
// router.get('/:id/', async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const serializable = await prisma.serializable.findUnique({
//       where: {
//         id: id,
//       },
//       include: {
//         renter: true,
//       },
//     });
//     if (serializable === null) {
//       return res.status(404).json(createResponse({ error: 'Serializable item does not exist', status: 404 }));
//     }
//     res.json(createResponse({ data: serializable }));
//   } catch (err) {
//     next(err);
//   }
// });

// /**
//  * Checkout Serializable
//  * Solve issue of double checking by using the following recommendation
//  *  https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#optimistic-concurrency-control
//  * */
// router.put('/:id/checkout/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { sub: userId } = req.user as JWTData;
//     // find serializable
//     const checkoutSerializable = await prisma.serializable.findFirst({
//       where: {
//         id,
//         userId: null,
//       },
//     });
//     if (checkoutSerializable === null) {
//       return res
//         .status(404)
//         .json(createResponse({ error: 'Serializable does not exist or item is checked out.', status: 404 }));
//     }
//     // uses version matcher to gaurantee that another renter hasn't checked out the item during the data race
//     const serializables = await prisma.serializable.updateMany({
//       data: {
//         userId,
//         version: {
//           increment: 1,
//         },
//       },
//       where: {
//         id: checkoutSerializable.id,
//         version: checkoutSerializable.version, //  only claim seat if in-memory version matches database version, indicating that the field has not been updated
//       },
//     });

//     if (serializables.count === 0) {
//       throw new Error(`This item was already checked out. Please try again.`);
//     }
//     // record the successful transaciton
//     await createTransaction(id, userId, 'CHECKOUT');
//     res.json(createResponse({ data: { serializables } }));
//   } catch (err) {
//     next(err);
//   }
// });

// /** Return an item, only if the person returning matches the current renter */
// router.put('/:id/return/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { sub: userId } = req.user as JWTData;
//     /** Insert logic to check if request id requesting change is the same as the current renter */
//     const serializable = await prisma.serializable.findUnique({
//       where: {
//         id,
//       },
//     });
//     if (serializable === null) {
//       return res.status(404).json(createResponse({ error: 'Item does not exist', status: 404 }));
//     }
//     if (serializable.userId === null) {
//       return res
//         .status(400)
//         .json(createResponse({ error: 'You cannot return an item that is not being rented', status: 400 }));
//     }
//     if (serializable.userId !== userId) {
//       return res
//         .status(401)
//         .json(createResponse({ error: 'You cannot return an item that someone else is renting', status: 401 }));
//     }
//     const updateAction = prisma.serializable.update({
//       where: {
//         id,
//       },
//       data: {
//         userId: null,
//       },
//     });
//     const recordAction = createTransaction(id, userId, 'RETURN');
//     const [actionResult] = await prisma.$transaction([updateAction, recordAction]);
//     res.json(createResponse({ data: actionResult }));
//   } catch (err) {
//     next(err);
//   }
// });

// /** Helper function to create a transaction */
// function createTransaction(serializableId: string, userId: number, type: Transaction['type']) {
//   return prisma.transaction.create({
//     data: {
//       serializableId,
//       userId,
//       type,
//     },
//   });
// }

// export default router;
