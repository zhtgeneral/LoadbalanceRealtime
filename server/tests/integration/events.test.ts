import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';

import DBService from '../../src/services/databaseService';
import NotificationService from '../../src/services/notificationService';
import ClientService from '../../src/services/clientService';
import { postEvent } from '../../src/routes/events';
import { loadBalance } from '../../src/middleware/middleware';
import { server } from '../../src';

describe('POST /events', () => {
  let app: express.Express;
  
  before(() => {
    app = express();
    app.use(express.json());
    app.use('/api/events', loadBalance, postEvent);    
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return 200 for successful event', async () => {
    sinon.stub(DBService, 'saveToDB').resolves();
    sinon.stub(NotificationService, 'sendNotification').resolves();
    sinon.stub(ClientService, 'broadcastToClients').resolves();

    const res = await request(app)
      .post('/api/events')
      .send({ 
        message: 'test message' 
      })
      .expect(200)

    expect(res.body).to.deep.equals({
      success: true,
      message: 'Event handled successfully'
    })
  });
});
