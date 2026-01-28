// RAG (Retrieval-Augmented Generation) for Hekmo
// Uses Supabase pgvector for embeddings storage

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Initialize Supabase client
export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase credentials not configured");
  }
  return createClient(supabaseUrl, supabaseKey);
}

// Generate embeddings using OpenAI
async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate embedding");
  }

  const data = await response.json();
  return data.data[0].embedding;
}

// Store document with embedding
export async function storeDocument({
  content,
  metadata,
  userId,
}: {
  content: string;
  metadata?: Record<string, unknown>;
  userId: string;
}) {
  const supabase = getSupabaseClient();
  const embedding = await generateEmbedding(content);

  const { data, error } = await supabase
    .from("documents")
    .insert({
      content,
      embedding,
      metadata,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Search similar documents
export async function searchDocuments({
  query,
  userId,
  limit = 5,
  threshold = 0.7,
}: {
  query: string;
  userId: string;
  limit?: number;
  threshold?: number;
}) {
  const supabase = getSupabaseClient();
  const queryEmbedding = await generateEmbedding(query);

  // Use Supabase's vector similarity search
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: limit,
    filter_user_id: userId,
  });

  if (error) throw error;
  return data || [];
}

// RAG query - search and format context
export async function ragQuery({
  query,
  userId,
}: {
  query: string;
  userId: string;
}): Promise<{
  context: string;
  sources: Array<{ content: string; similarity: number }>;
}> {
  try {
    const results = await searchDocuments({ query, userId });

    if (results.length === 0) {
      return { context: "", sources: [] };
    }

    const context = results
      .map((doc: { content: string }, i: number) => `[${i + 1}] ${doc.content}`)
      .join("\n\n");

    return {
      context,
      sources: results.map((doc: { content: string; similarity: number }) => ({
        content: doc.content.slice(0, 200),
        similarity: doc.similarity,
      })),
    };
  } catch (error) {
    console.error("RAG query error:", error);
    return { context: "", sources: [] };
  }
}

// SQL to create the documents table with pgvector:
/*
-- Enable pgvector extension
create extension if not exists vector;

-- Create documents table
create table documents (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  embedding vector(1536),
  metadata jsonb,
  user_id uuid references "User"(id),
  created_at timestamp with time zone default now()
);

-- Create similarity search function
create or replace function match_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_user_id uuid
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 
    documents.user_id = filter_user_id
    and 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
$$;

-- Create index for faster similarity search
create index on documents using ivfflat (embedding vector_cosine_ops)
with (lists = 100);
*/
