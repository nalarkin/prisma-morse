/**
 * Alternative way of creating json validators (that are less customizable but easier to create).
 *
 * Will probably remove in the future.
 */

import type { Serializable } from '@prisma/client';
import { JTDSchemaType } from 'ajv/dist/core';
export const serializableTypeSchema: JTDSchemaType<Serializable> = {
  properties: {
    brand: { type: 'string', nullable: true },
    description: { type: 'string', nullable: true },
    guide: { type: 'string', nullable: true },
    photo: { type: 'string', nullable: true },
    status: { enum: ['BROKEN', 'IN_REPAIR', 'SCRAP', 'USABLE'] },
    id: { type: 'string' },
    name: { type: 'string' },
    project: { type: 'string', nullable: true },
    serial_number: { type: 'string' },
    type: { enum: ['CONSUMABLE', 'DEVICE', 'TOOL'] },
    updatedAt: { type: 'timestamp' },
    userId: { type: 'int32', nullable: true },
    version: { type: 'int32' },
    createdAt: { type: 'timestamp' },
  },
};
