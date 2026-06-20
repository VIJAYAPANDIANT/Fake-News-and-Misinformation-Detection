const bcrypt = require('bcryptjs');

// Global memory database store
global.mockDb = global.mockDb || {
  users: [],
  predictions: [],
  feedbacks: []
};

// Simple helper to create a model proxy
function createModelProxy(mongooseModel, mockClass) {
  return new Proxy(mongooseModel, {
    get(target, prop) {
      if (global.useMockDb) {
        return mockClass[prop] || target[prop];
      }
      return target[prop];
    },
    construct(target, args) {
      if (global.useMockDb) {
        return new mockClass(...args);
      }
      return new target(...args);
    }
  });
}

// Mock User Implementation
class MockUser {
  constructor(data) {
    this._id = 'user_' + Date.now() + Math.random().toString(36).substr(2, 9);
    this.name = data.name;
    this.email = (data.email || '').toLowerCase();
    this.password = data.password;
    this.role = data.role || 'user';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    global.mockDb.users.push(this);
    return this;
  }

  static findOne(query) {
    const execute = () => {
      let email = query.email;
      if (email && typeof email === 'object' && email.email) {
        email = email.email;
      }
      const user = global.mockDb.users.find(u => u.email === (email || '').toLowerCase());
      if (!user) return null;

      // Return object with matchPassword method
      return {
        ...user,
        matchPassword: async function(enteredPassword) {
          return await bcrypt.compare(enteredPassword, this.password);
        }
      };
    };

    return {
      select: function(fields) {
        return this; // Chainable select method
      },
      then: function(resolve, reject) {
        try {
          resolve(execute());
        } catch (err) {
          reject(err);
        }
      }
    };
  }

  static findById(id) {
    const user = global.mockDb.users.find(u => u._id === id);
    return {
      then: function(resolve) {
        resolve(user || null);
      }
    };
  }

  static async create(data) {
    const userInstance = new MockUser(data);
    return await userInstance.save();
  }

  static find(query) {
    let list = [...global.mockDb.users];
    const thenable = {
      sort: function(sortQuery) {
        list.sort((a, b) => b.createdAt - a.createdAt);
        return this;
      },
      then: function(resolve) {
        resolve(list);
      }
    };
    return thenable;
  }

  static async countDocuments() {
    return global.mockDb.users.length;
  }
}

// Mock Prediction Implementation
class MockPrediction {
  constructor(data) {
    this._id = 'pred_' + Date.now() + Math.random().toString(36).substr(2, 9);
    this.userId = data.userId;
    this.title = data.title || '';
    this.newsText = data.newsText;
    this.prediction = data.prediction;
    this.confidenceScore = data.confidenceScore;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    global.mockDb.predictions.push(this);
    return this;
  }

  static async create(data) {
    const predInstance = new MockPrediction(data);
    return await predInstance.save();
  }

  static find(query) {
    const userId = query.userId;
    let history = userId 
      ? global.mockDb.predictions.filter(p => p.userId === userId)
      : [...global.mockDb.predictions];
      
    const thenable = {
      sort: function(sortQuery) {
        history.sort((a, b) => b.createdAt - a.createdAt);
        return this;
      },
      then: function(resolve) {
        resolve(history);
      }
    };
    return thenable;
  }

  static findById(id) {
    const pred = global.mockDb.predictions.find(p => p._id === id);
    return {
      then: function(resolve) {
        if (!pred) return resolve(null);
        resolve({
          ...pred,
          deleteOne: async function() {
            global.mockDb.predictions = global.mockDb.predictions.filter(p => p._id !== id);
            return { deletedCount: 1 };
          }
        });
      }
    };
  }

  static async countDocuments() {
    return global.mockDb.predictions.length;
  }

  static async aggregate(pipeline) {
    // Simple mock of aggregate breakdown for Real/Fake
    const counts = { Real: 0, Fake: 0 };
    global.mockDb.predictions.forEach(p => {
      if (counts[p.prediction] !== undefined) {
        counts[p.prediction]++;
      }
    });
    return [
      { _id: 'Real', count: counts.Real },
      { _id: 'Fake', count: counts.Fake }
    ];
  }
}

// Mock Feedback Implementation
class MockFeedback {
  constructor(data) {
    this._id = 'feed_' + Date.now() + Math.random().toString(36).substr(2, 9);
    this.userId = data.userId;
    this.predictionId = data.predictionId;
    this.feedback = data.feedback;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    global.mockDb.feedbacks.push(this);
    return this;
  }

  static async create(data) {
    const feedInstance = new MockFeedback(data);
    return await feedInstance.save();
  }
}

module.exports = {
  createModelProxy,
  MockUser,
  MockPrediction,
  MockFeedback
};
