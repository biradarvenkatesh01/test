const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const LOCAL_STORAGE_KEY = 'imagefury_saved_gallery';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1024&q=80',
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1024&q=80',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1024&q=80',
  'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=1024&q=80',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1024&q=80',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1024&q=80',
];

function getLocalGallery() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalGallery(items) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save to local gallery', e);
  }
}

export async function generateImage(prompt, token) {
  const startTime = performance.now();
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error('Backend generation failed');
    const result = await response.json();
    
    const current = getLocalGallery();
    saveLocalGallery([result, ...current]);
    return result;
  } catch {
    const elapsed = ((performance.now() - startTime) / 1000 + 1.2).toFixed(1);
    const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);

    const fallbackImage = {
      id: `gen-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      prompt,
      imageUrl: FALLBACK_IMAGES[randomIndex],
      renderTime: `${elapsed}s`,
      seed: Math.floor(Math.random() * 9000000) + 1000000,
      timeAgo: 'Just now',
      createdAt: new Date().toISOString(),
      isOfflineFallback: true,
    };

    const current = getLocalGallery();
    saveLocalGallery([fallbackImage, ...current]);
    return fallbackImage;
  }
}

export async function fetchGallery(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    if (!response.ok) throw new Error('Fetch gallery failed');
    const remoteData = await response.json();
    if (Array.isArray(remoteData) && remoteData.length > 0) {
      return remoteData;
    }
  } catch {
    // Fallback
  }
  return getLocalGallery();
}

export async function deleteGalleryImage(id, token) {
  const current = getLocalGallery();
  const updated = current.filter((item) => item.id !== id);
  saveLocalGallery(updated);

  try {
    await fetch(`${API_BASE_URL}/gallery/${id}`, { 
      method: 'DELETE',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
  } catch {
    console.warn('Backend delete failed, operating offline');
  }

  return updated;
}
