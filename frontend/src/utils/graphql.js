import { request } from 'graphql-request'
import React from 'react';
import ReactDOM from 'react-dom/client';


const url = import.meta.env.VITE_SUBGRAPH_API_URL
const api_key = import.meta.env.VITE_SUBGRAPH_API_KEY
const headers = { Authorization: `Bearer ${api_key}` }

export default async function graphql(query) {
  try {
    const data = await request(url, query, {}, headers);

    console.log('GraphQL request succeeded:', JSON.stringify(data));
    
    return JSON.stringify(data);
  } catch (error) {
    console.error('GraphQL request failed:', error);
    return {} 

  }
}