import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';

/** keep this line below. This allows the test to run */
import { server } from '../../src'; 
import DBService from '../../src/services/databaseService';
import NotificationService from '../../src/services/notificationService';
import ClientService from '../../src/services/clientService';
import { postEvent } from '../../src/routes/events';
import { loadBalance } from '../../src/middleware/middleware';
import LoadBalancer from '../../src/services/loadBalancer';

describe('POST /events', () => {
  let app: express.Express;

  const fakeServer = 'test-server';
  const fakeMessage = "test-message";
  const fakeEvent = {
    id: "test uuid",
    message: `[${fakeServer}] ${fakeMessage}`,
    timestamp: new Date().toISOString(),
  }
  
  before(() => {
    app = express();
    app.use(express.json());
    app.use('/api/events', loadBalance, postEvent);    
  });

  beforeEach(() => {
    sinon.stub(LoadBalancer, 'pickAvailableServer').resolves(fakeServer);
  })

  afterEach(() => {
    sinon.restore();
  });

  it('should return 503 for no available servers', async () => {
    sinon.restore();
    sinon.stub(LoadBalancer, 'pickAvailableServer').resolves(null);

    const res = await request(app)
      .post('/api/events')
      .send({
        message: "test message"
      })
      .expect(503)

    expect(res.body).to.deep.equals({
      success: false,
      error: 'All servers busy'
    })
  })

  it('should return 400 for missing message', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({})
      .expect(400)

    expect(res.body).to.deep.equals({
      success: false,
      error: 'message is required'
    })
  })

  it('should return 200 for successful event', async () => {
    sinon.stub(ClientService, 'createEvent').returns(fakeEvent);
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
      message: 'Event handled successfully',
      event: fakeEvent
    })
  });

  it('should return 200 even if DBService fails', async () => {
    sinon.stub(ClientService, 'createEvent').returns(fakeEvent);
    sinon.stub(DBService, 'saveToDB').throws(new Error("Some error related to saving to DB"));
    sinon.stub(NotificationService, 'sendNotification').resolves();
    sinon.stub(ClientService, 'broadcastToClients').resolves();

    const res = await request(app)
      .post('/api/events')
      .send({
        message: "test message"
      })
      .expect(200)

    expect(res.body).to.deep.equals({
      success: true,
      message: 'Event handled successfully',
      event: fakeEvent
    })
  })

  it('should return 200 even if NotificationService fails', async () => {
    sinon.stub(ClientService, 'createEvent').returns(fakeEvent);
    sinon.stub(DBService, 'saveToDB').resolves();
    sinon.stub(NotificationService, 'sendNotification').throws(new Error("Some error related to sending notifications"));
    sinon.stub(ClientService, 'broadcastToClients').resolves();

    const res = await request(app)
      .post('/api/events')
      .send({
        message: "test message"
      })
      .expect(200)

    expect(res.body).to.deep.equals({
      success: true,
      message: 'Event handled successfully',
      event: fakeEvent
    })
  })

  it('should return 500 if ClientService fails', async () => {
    sinon.stub(DBService, 'saveToDB').resolves();
    sinon.stub(NotificationService, 'sendNotification').resolves();
    sinon.stub(ClientService, 'broadcastToClients').throws(new Error("Some error related to broadcasting messages"));

    const res = await request(app)
      .post('/api/events')
      .send({
        message: "test message"
      })
      .expect(500)

    expect(res.body).to.deep.equals({
      success: false,
      error: 'Unable to broadcast message'
    })
  })
});
