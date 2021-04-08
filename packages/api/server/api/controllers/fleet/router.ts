import express from 'express';
import controller from './controller';
export default express
  .Router()
  .post('/', controller.set)
  .get('/', controller.all)
  .get('/:uuid', controller.byUuid);
