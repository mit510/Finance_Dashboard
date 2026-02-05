import { useState, useRef } from 'react';
import {
    Moon,
    Sun,
    User,
    Mail,
    Bell,
    Download,
    Trash2,
    Save,
    Camera,
    Loader,
    Check
} from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { logout } from '../services/auth';
import { updateUserDisplayName, uploadProfilePicture } from '../services/userService';

export default function Settings({ user }) {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [displayName, setDisplayName] = useState(user.displayName || '');
    const [profilePicture, setProfilePicture] = useState(user.photoURL || null);
    const [notifications, setNotifications] = useState(true);
    const [currency, setCurrency] = useState('USD');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const fileInputRef = useRef(null);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateUserDisplayName(user.uid, displayName);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);

            // Force a page reload to update the display name everywhere
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setUploadingPhoto(true);
        try {
            const result = await uploadProfilePicture(user.uid, file);
            setProfilePicture(result.photoURL);

            // Force a page reload to update the photo everywhere
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Failed to upload photo. Please try again.');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleExportData = () => {
        // Export data logic
        alert('Export feature coming soon!');
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            // Delete account logic
            alert('Account deletion feature coming soon!');
        }
    };

    return (
        <div className="w-full space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white font-display">
                    Settings ⚙️
                </h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                    Manage your account and preferences
                </p>
            </div>

            {/* Profile Section */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card border border-neutral-100 dark:border-neutral-700 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6">
                    <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
                </div>

                <div className="p-6 space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            {profilePicture ? (
                                <img
                                    src={profilePicture}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-neutral-700 shadow-lg"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                    {displayName?.[0] || user.email?.[0] || 'U'}
                                </div>
                            )}

                            <button
                                onClick={handlePhotoClick}
                                disabled={uploadingPhoto}
                                className="absolute bottom-0 right-0 p-2 bg-white dark:bg-neutral-700 rounded-full shadow-lg border-2 border-white dark:border-neutral-600 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploadingPhoto ? (
                                    <Loader size={16} className="text-neutral-700 dark:text-neutral-300 animate-spin" />
                                ) : (
                                    <Camera size={16} className="text-neutral-700 dark:text-neutral-300" />
                                )}
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </div>
                        <div>
                            <h3 className="font-semibold text-neutral-900 dark:text-white">Profile Photo</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Click the camera icon to upload a new photo
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                                JPG, PNG or GIF. Max size 5MB
                            </p>
                        </div>
                    </div>

                    {/* Display Name */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            <User size={16} className="inline mr-2" />
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl 
                       focus:ring-2 focus:ring-primary-200 focus:border-primary-500 
                       transition-all outline-none bg-white dark:bg-neutral-700
                       text-neutral-900 dark:text-white"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email (read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            <Mail size={16} className="inline mr-2" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl 
                       bg-neutral-100 dark:bg-neutral-700/50 text-neutral-500 dark:text-neutral-400
                       cursor-not-allowed"
                        />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            Email cannot be changed
                        </p>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving || saved}
                        className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white
              transition-all duration-300 transform active:scale-95
              disabled:opacity-70 disabled:cursor-not-allowed
              ${saved
                                ? 'bg-success-500 hover:bg-success-600'
                                : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700'
                            }
            `}
                    >
                        {saving ? (
                            <>
                                <Loader size={20} className="animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : saved ? (
                            <>
                                <Check size={20} />
                                <span>Saved!</span>
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Appearance Section */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card border border-neutral-100 dark:border-neutral-700 p-6">
                <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
                    Appearance
                </h2>

                <div className="space-y-4">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
                        <div className="flex items-center gap-3">
                            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                            <div>
                                <h3 className="font-medium text-neutral-900 dark:text-white">Dark Mode</h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {darkMode ? 'Currently enabled' : 'Currently disabled'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className={`
                relative w-14 h-8 rounded-full transition-colors duration-300
                ${darkMode ? 'bg-primary-500' : 'bg-neutral-300'}
              `}
                        >
                            <div className={`
                absolute top-1 w-6 h-6 bg-white rounded-full shadow-md
                transition-transform duration-300
                ${darkMode ? 'translate-x-7' : 'translate-x-1'}
              `} />
                        </button>
                    </div>

                    {/* Currency Preference */}
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
                        <label className="block font-medium text-neutral-900 dark:text-white mb-2">
                            Currency
                        </label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg
                       bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white
                       focus:ring-2 focus:ring-primary-200 outline-none"
                        >
                            <option value="CAD">CAD ($)</option>
                            <option value="USD">USD ($)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="INR">INR (₹)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card border border-neutral-100 dark:border-neutral-700 p-6">
                <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
                    Notifications
                </h2>

                <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                        <Bell size={20} />
                        <div>
                            <h3 className="font-medium text-neutral-900 dark:text-white">Push Notifications</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Receive updates about your finances
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setNotifications(!notifications)}
                        className={`
              relative w-14 h-8 rounded-full transition-colors duration-300
              ${notifications ? 'bg-primary-500' : 'bg-neutral-300'}
            `}
                    >
                        <div className={`
              absolute top-1 w-6 h-6 bg-white rounded-full shadow-md
              transition-transform duration-300
              ${notifications ? 'translate-x-7' : 'translate-x-1'}
            `} />
                    </button>
                </div>
            </div>

            {/* Data & Privacy Section */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card border border-neutral-100 dark:border-neutral-700 p-6">
                <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
                    Data & Privacy
                </h2>

                <div className="space-y-3">
                    <button
                        onClick={handleExportData}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-50 dark:bg-neutral-700/50 
                     hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-xl transition-colors
                     text-neutral-900 dark:text-white"
                    >
                        <Download size={20} />
                        <div className="text-left">
                            <p className="font-medium">Export Your Data</p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Download all your transaction data
                            </p>
                        </div>
                    </button>

                    <button
                        onClick={handleDeleteAccount}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 
                     hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors
                     text-red-600 dark:text-red-400"
                    >
                        <Trash2 size={20} />
                        <div className="text-left">
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm">
                                Permanently delete your account and data
                            </p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Logout Section */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card border border-neutral-100 dark:border-neutral-700 p-6">
                <button
                    onClick={logout}
                    className="w-full px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 
                   hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-xl font-semibold
                   transition-all duration-200 active:scale-95"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}