/**
 * KCD Best Practice: Small, representative fixture for deterministic tests.
 *
 * This fixture contains a curated set of users for tests that need
 * predictable data. For tests that need large datasets (simulating
 * real-world 5k+ line JSON responses), use buildUsers() from generate-users.ts.
 *
 * Pattern: Keep fixtures small and representative. Generate large data sets
 * on the fly using factory functions.
 */
import type { User } from '@/types/user'

export const users: User[] = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'leanne.graham',
    email: 'leanne@example.com',
    address: {
      street: '556 Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: { lat: '-37.3159', lng: '81.1496' },
    },
    phone: '770-736-8031',
    website: 'leanne.org',
    company: {
      name: 'Romaguera-Crona',
      catchPhrase: 'Multi-layered client-server neural-net',
      bs: 'harness real-time e-markets',
    },
    status: 'active',
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'ervin.howell',
    email: 'ervin@example.com',
    address: {
      street: '264 Victor Plains',
      suite: 'Suite 879',
      city: 'Wisokyburgh',
      zipcode: '90566-7771',
      geo: { lat: '-43.9509', lng: '-34.4618' },
    },
    phone: '010-692-6593',
    website: 'ervin.com',
    company: {
      name: 'Deckow-Crist',
      catchPhrase: 'Proactive didactic contingency',
      bs: 'synergize scalable supply-chains',
    },
    status: 'active',
  },
  {
    id: 3,
    name: 'Clementine Bauch',
    username: 'clementine.bauch',
    email: 'clementine@example.com',
    address: {
      street: '337 Hoeger Mall',
      suite: 'Apt. 692',
      city: 'McKenziehaven',
      zipcode: '59590-4157',
      geo: { lat: '-68.6102', lng: '-47.0653' },
    },
    phone: '463-123-4447',
    website: 'clementine.net',
    company: {
      name: 'Romaguera-Jacobson',
      catchPhrase: 'Face to face bifurcated interface',
      bs: 'e-enable strategic applications',
    },
    status: 'inactive',
  },
  {
    id: 4,
    name: 'Patricia Lebsack',
    username: 'patricia.lebsack',
    email: 'patricia@example.com',
    address: {
      street: '2476 Hoeger Mall',
      suite: 'Suite 101',
      city: 'South Elvis',
      zipcode: '53919-4257',
      geo: { lat: '29.4572', lng: '-164.2990' },
    },
    phone: '493-170-9623',
    website: 'patricia.info',
    company: {
      name: 'Robel-Corkery',
      catchPhrase: 'Multi-tiered zero tolerance productivity',
      bs: 'transition cutting-edge web services',
    },
    status: 'active',
  },
  {
    id: 5,
    name: 'Chelsey Dietrich',
    username: 'chelsey.dietrich',
    email: 'chelsey@example.com',
    address: {
      street: '33 Skiles Walks',
      suite: 'Suite 351',
      city: 'Roscoeview',
      zipcode: '33263',
      geo: { lat: '-31.8129', lng: '62.5342' },
    },
    phone: '254-954-1289',
    website: 'chelsey.net',
    company: {
      name: 'Keebler LLC',
      catchPhrase: 'User-centric fault-tolerant solution',
      bs: 'revolutionize end-to-end systems',
    },
    status: 'inactive',
  },
]
