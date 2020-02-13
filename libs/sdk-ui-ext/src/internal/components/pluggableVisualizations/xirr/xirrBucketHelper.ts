// (C) 2019-2020 GoodData Corporation
import { IReferencePoint, IBucketOfFun } from "../../../interfaces/Visualization";
import { BucketNames } from "@gooddata/sdk-ui";
import {
    getDateItems,
    findBucket,
    limitNumberOfMeasuresInBuckets,
    getMeasures,
} from "../../../utils/bucketHelper";

export const getXirrBuckets = ({ buckets }: Readonly<IReferencePoint>): IBucketOfFun[] => {
    const limitedMeasureBuckets = limitNumberOfMeasuresInBuckets(buckets, 1);

    const currentMeasureBucket = findBucket(limitedMeasureBuckets, BucketNames.MEASURES);
    const currentAttributeBucket = findBucket(buckets, BucketNames.ATTRIBUTE);

    const measureItem = getMeasures(limitedMeasureBuckets)[0];
    const dateAttributeItem = getDateItems(buckets)[0];

    return [
        {
            ...currentMeasureBucket,
            localIdentifier: BucketNames.MEASURES,
            items: measureItem ? [measureItem] : [],
        },
        {
            ...currentAttributeBucket,
            localIdentifier: BucketNames.ATTRIBUTE,
            items: dateAttributeItem ? [dateAttributeItem] : [],
        },
    ];
};