const { Kafka } = require('kafkajs');
const logger = require('../utils/logger');

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'order-service',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  logger.info('Kafka producer connected');
};

const disconnectProducer = async () => {
  await producer.disconnect();
  logger.info('Kafka producer disconnected');
};

const publishEvent = async (topic, event) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(event) }],
  });
  logger.info(`Event published to topic "${topic}": ${event.type}`);
};

module.exports = { connectProducer, disconnectProducer, publishEvent };
