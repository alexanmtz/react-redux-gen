import { genPlainActions } from '../src/gen-actions'
import { genReducer } from '../src/gen-reducers'

describe('Testing reducers', () => {
  describe('Reducer for create actions', () => {
    test('Reducer for the initial state', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, {})).toEqual({
        data: {}, error: false, completed: true 
      });
    });
    test('Reducer for the create action requested', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, genPlainActions('user')['create'][0]())).toEqual({
        data: {}, error: false, completed: false 
      });
    });
    test('Reducer for the create action success', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, genPlainActions('user')['create'][1]({name: 'John Doe'}))).toEqual({
        data: {name: 'John Doe'}, error: false, completed: true 
      });
    });
    test('Reducer for the create action error', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, genPlainActions('user')['create'][2]({code: 100}))).toEqual({
        data: {}, error: {code: 100}, completed: true 
      });
    });
  });
  describe('Reducer for update actions', () => {
    test('Reducer for the initial state', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, {})).toEqual({
        data: {}, error: false, completed: true 
      });
    });
    test('Reducer for the create action requested', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, genPlainActions('user')['update'][0]())).toEqual({
        data: {}, error: false, completed: false 
      });
    });
    test('Reducer for the create action success', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, genPlainActions('user')['update'][1]({name: 'John Doe'}))).toEqual({
        data: {name: 'John Doe'}, error: false, completed: true 
      });
    });
    test('Reducer for the create action error', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, genPlainActions('user')['update'][2]({code: 100}))).toEqual({
        data: {}, error: {code: 100}, completed: true 
      });
    });
  });
  describe('Reducer for delete actions', () => {
    test('Reducer for the initial state', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, {})).toEqual({
        data: {}, error: false, completed: true 
      });
    });
    test('Reducer for the create action requested', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, genPlainActions('user')['delete'][0]())).toEqual({
        data: {}, error: false, completed: false 
      });
    });
    test('Reducer for the create action success', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, genPlainActions('user')['delete'][1]({name: 'John Doe'}))).toEqual({
        data: {name: 'John Doe'}, error: false, completed: true 
      });
    });
    test('Reducer for the create action error', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, genPlainActions('user')['delete'][2]({code: 100}))).toEqual({
        data: {}, error: {code: 100}, completed: true 
      });
    });
  });
  describe('Reducer for list actions', () => {
    test('Reducer for the initial state', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, {})).toEqual({
        data: {}, error: false, completed: true 
      });
    });
    test('Reducer for the create action requested', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, genPlainActions('user')['list'][0]())).toEqual({
        data: {}, error: false, completed: false 
      });
    });
    test('Reducer for the create action success', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, genPlainActions('user')['list'][1]([{name: 'John Doe'}]))).toEqual({
        data: [{name: 'John Doe'}], error: false, completed: true 
      });
    });
    test('Reducer for the create action error', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, genPlainActions('user')['list'][2]({code: 100}))).toEqual({
        data: {}, error: {code: 100}, completed: true 
      });
    });
  });
  describe('Reducer for fetch actions', () => {
    test('Reducer for the initial state', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, {})).toEqual({
        data: {}, error: false, completed: true 
      });
    });
    test('Reducer for the create action requested', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, genPlainActions('user')['fetch'][0]())).toEqual({
        data: {}, error: false, completed: false 
      });
    });
    test('Reducer for the create action success', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, genPlainActions('user')['fetch'][1]({name: 'John Doe'}))).toEqual({
        data: {name: 'John Doe'}, error: false, completed: true 
      });
    });
    test('Reducer for the create action error', () => {
      expect(genReducer('user', { data: {}, error: false, completed: true })(undefined, genPlainActions('user')['fetch'][2]({code: 100}))).toEqual({
        data: {}, error: {code: 100}, completed: true 
      });
    });
  });
})
