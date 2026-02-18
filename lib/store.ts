import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { get, set as idbSet, del } from 'idb-keyval';
import { Asset, Folder, User, AssetVersion } from './types';

interface DAMStore {
  assets: Asset[];
  folders: Folder[];
  user: User | null;
  searchQuery: string;

  // Actions
  setSearchQuery: (query: string) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  deleteAssetsBulk: (ids: string[]) => void;

  addFolder: (folder: Folder) => void;
  updateFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  moveAsset: (assetId: string, folderId: string | null) => void;

  addVersion: (assetId: string, version: AssetVersion) => void;
  restoreVersion: (assetId: string, versionId: string) => void;

  setUser: (user: User | null) => void;
}

// Custom storage using IndexedDB for unlimited capacity
const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await idbSet(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

// Mock initial data
const initialAssets: Asset[] = [
  {
    id: '1',
    name: 'Nature Landscape.jpg',
    type: 'image',
    size: 2500000,
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=200',
    tags: ['nature', 'landscape'],
    folderId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    versions: [],
    metadata: { width: 1920, height: 1080, mimeType: 'image/jpeg' }
  },
  {
    id: '2',
    name: 'Corporate Overview.pdf',
    type: 'pdf',
    size: 15000000,
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    tags: ['corporate', 'report'],
    folderId: 'f1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    versions: [],
    metadata: { pages: 10, mimeType: 'application/pdf' }
  }
];

const initialFolders: Folder[] = [
  { id: 'f1', name: 'Reports', parentId: null, createdAt: new Date().toISOString() },
  { id: 'f2', name: 'Images', parentId: null, createdAt: new Date().toISOString() },
];

export const useDAMStore = create<DAMStore>()(
  persist(
    (set) => ({
      assets: initialAssets,
      folders: initialFolders,
      user: { id: 'u1', name: 'Jules Dev', email: 'jules@example.com', role: 'admin' },
      searchQuery: '',

      setSearchQuery: (query) => set({ searchQuery: query }),

      addAsset: (asset) => set((state) => ({
        assets: [asset, ...state.assets]
      })),

      updateAsset: (id, updates) => set((state) => ({
        assets: state.assets.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a))
      })),

      deleteAsset: (id) => set((state) => ({
        assets: state.assets.filter((a) => a.id !== id)
      })),

      deleteAssetsBulk: (ids) => set((state) => ({
        assets: state.assets.filter((a) => !ids.includes(a.id))
      })),

      addFolder: (folder) => set((state) => ({
        folders: [...state.folders, folder]
      })),

      updateFolder: (id, name) => set((state) => ({
        folders: state.folders.map((f) => (f.id === id ? { ...f, name } : f))
      })),

      deleteFolder: (id) => set((state) => ({
        folders: state.folders.filter((f) => f.id !== id),
        assets: state.assets.map((a) => a.folderId === id ? { ...a, folderId: null } : a)
      })),

      moveAsset: (assetId, folderId) => set((state) => ({
        assets: state.assets.map((a) => (a.id === assetId ? { ...a, folderId } : a))
      })),

      addVersion: (assetId, version) => set((state) => ({
        assets: state.assets.map((a) =>
          a.id === assetId ? { ...a, versions: [version, ...a.versions], updatedAt: new Date().toISOString() } : a
        )
      })),

      restoreVersion: (assetId, versionId) => set((state) => {
        const asset = state.assets.find(a => a.id === assetId);
        if (!asset) return state;
        const version = asset.versions.find(v => v.id === versionId);
        if (!version) return state;

        return {
          assets: state.assets.map((a) =>
            a.id === assetId ? {
              ...a,
              url: version.url,
              size: version.size,
              updatedAt: new Date().toISOString()
            } : a
          )
        };
      }),

      setUser: (user) => set({ user }),
    }),
    {
      name: 'dam-storage',
      storage: createJSONStorage(() => indexedDBStorage),
    }
  )
);
