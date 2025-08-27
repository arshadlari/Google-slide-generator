import type { UserToken } from '../types/UserToken.js';
import type { CustomTheme } from "./ThemeDBService.ts";

export interface DBService {
    getUserToken(userId: string): Promise<UserToken | null>;
    storeOrUpdateUserToken(token: Partial<UserToken> & Pick<UserToken, 'user_id'>): Promise<void>;
    close(): Promise<void>;
    
    // Theme management methods
    createTheme(theme: Omit<CustomTheme, 'id' | 'created_at'>): Promise<CustomTheme>;
    getThemeById(themeId: string): Promise<CustomTheme | null>;
    getThemesByUser(userId: string): Promise<CustomTheme[]>;
    getAllThemes(): Promise<CustomTheme[]>;
    updateTheme(themeId: string, userId: string, updates: Partial<Pick<CustomTheme, 'theme_desc' | 'schema_str'>>): Promise<CustomTheme | null>;
    deleteTheme(themeId: string, userId: string): Promise<boolean>;
    isThemeOwner(themeId: string, userId: string): Promise<boolean>;

    // Layout methods
    getLayoutById(layoutId: string): Promise<{ id: string; name: string | null; data: any } | null>;
    getAllLayouts(): Promise<Array<{ id: string; name: string | null; data: any }>>;
    getAllLayoutsIdAndName(): Promise<Record<string, string | null>>;
    // Content models
    getAllContentModels(): Promise<{ id: string; name: string; fields: any[]; mapped_layouts: any[] }[]>;
}