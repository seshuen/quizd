import { expect } from 'chai';
import { createClient } from '@/lib/supabase/client';

describe('lib/supabase/client', () => {
  describe('createClient() - Browser Supabase Client', () => {
    it('should create a Supabase client instance', () => {
      const client = createClient();

      expect(client).to.exist;
      expect(client).to.be.an('object');
    });

    it('should have auth property', () => {
      const client = createClient();

      expect(client.auth).to.exist;
      expect(client.auth).to.be.an('object');
    });

    it('should have auth methods available', () => {
      const client = createClient();

      expect(client.auth.signUp).to.be.a('function');
      expect(client.auth.signInWithPassword).to.be.a('function');
      expect(client.auth.signOut).to.be.a('function');
      expect(client.auth.getSession).to.be.a('function');
      expect(client.auth.onAuthStateChange).to.be.a('function');
    });

    it('should have from method for database queries', () => {
      const client = createClient();

      expect(client.from).to.be.a('function');
    });

    it('should create database query builder', () => {
      const client = createClient();
      const query = client.from('profiles');

      expect(query).to.exist;
      expect(query.select).to.be.a('function');
      expect(query.insert).to.be.a('function');
      expect(query.update).to.be.a('function');
      expect(query.delete).to.be.a('function');
    });
  });
});
