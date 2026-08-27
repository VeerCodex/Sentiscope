import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

_supabase_client = None

def get_supabase_client():
    """
    Returns the Supabase Client if credentials are configured in .env,
    otherwise returns None to trigger local SQLite fallback.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    supabase_url = os.getenv("SUPABASE_URL", "").strip()
    supabase_key = os.getenv("SUPABASE_KEY", "").strip()

    if supabase_url and supabase_key:
        try:
            from supabase import create_client, Client
            _supabase_client = create_client(supabase_url, supabase_key)
            print("Successfully connected to Supabase PostgreSQL Database.")
            return _supabase_client
        except Exception as e:
            print(f"Warning: Failed to initialize Supabase client ({e}). Falling back to Local SQLite.")
            return None
    return None
