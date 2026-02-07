import { useState, useEffect } from 'react';
import {
    Moon,
    Sun,
    User,
    Mail,
    Bell,
    Download,
    Trash2,
    Save,
    Loader,
    Check,
    AlertCircle,
    Palette,
    FileJson,
    FileSpreadsheet,
    File
} from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { logout } from '../services/auth';
import { updateUserDisplayName } from '../services/userService';
import { exportToJSON, exportToCSV, exportToExcel } from '../services/exportService';

// Predefined gradient colors for avatars
const AVATAR_GRADIENTS = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-green-400 to-green-600',
    'from-yellow-400 to-yellow-600',
    'from-red-400 to-red-600',
    'from-indigo-400 to-indigo-600',
    'from-cyan-400 to-cyan-600',
    'from-orange-400 to-orange-600',
    'from-teal-400 to-teal-600',
];

export default function Settings({ user }) {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [displayName, setDisplayName] = useState(user.displayName || '');
    const [selectedGradient, setSelectedGradient] = useState(0);
    const [notifications, setNotifications] = useState(true);
    const [currency, setCurrency] = useState('USD');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [hasChanges, setHasChanges] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState('');

    // Initialize gradient from user's email/name
    useEffect(() => {
        const email = user.email || '';
        const charCode = email.charCodeAt(0) || 0;
        setSelectedGradient(charCode % AVATAR_GRADIENTS.length);
    }, [user.email]);

    // Track changes
    useEffect(() => {
        const nameChanged = displayName !== (user.displayName || '');
        setHasChanges(nameChanged);
    }, [displayName, user.displayName]);

    const handleSave = async () => {
        if (!hasChanges) return;

        if (!displayName.trim()) {
            setError('Display name cannot be empty');
            return;
        }

        setSaving(true);
        setError('');

        try {
            await updateUserDisplayName(user.uid, displayName.trim());

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);

            if (user.displayName !== displayName.trim()) {
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }

        } catch (err) {
            console.error('Error saving profile:', err);
            setError(err.message || 'Failed to save changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleExport = async (format) => {
        setExporting(true);
        setError('');
        setExportSuccess('');

        try {
            let result;
            switch (format) {
                case 'json':
                    result = await exportToJSON(user.uid, displayName || user.email);
                    break;
                case 'csv':
                    result = await exportToCSV(user.uid);
                    break;
                case 'excel':
                    result = await exportToExcel(user.uid);
                    break;
                default:
                    throw new Error('Invalid format');
            }

            setExportSuccess(`Successfully exported ${result.count} transactions!`);
            setTimeout(() => setExportSuccess(''), 3000);
        } catch (err) {
            console.error('Error exporting data:', err);
            setError(err.message || 'Failed to export data. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            alert('Account deletion feature coming soon!');
        }
    };

    const getInitials = () => {
        if (displayName) {
            return displayName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
        }
        return (user.email?.[0] || 'U').toUpperCase();
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

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-medium text-red-900 dark:text-red-200">Error</p>
                        <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                    </div>
                    <button
                        onClick={() => setError('')}
                        className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 text-xl leading-none"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Success Alert */}
            {(saved || exportSuccess) && !saving && !exporting && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-start gap-3">
                    <Check size={20} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="font-medium text-green-900 dark:text-green-200">Success!</p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                            {exportSuccess || 'Your changes have been saved'}
                        </p>
                    </div>
                </div>
            )}

            {/* Profile Section */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card border border-neutral-100 dark:border-neutral-700 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-6">
                    <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
                </div>

                <div className="p-6 space-y-6">
                    {/* Avatar with Color Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-6">
                            <div className={`w-24 h-24 bg-gradient-to-br ${AVATAR_GRADIENTS[selectedGradient]} rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg`}>
                                {getInitials()}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-neutral-900 dark:text-white">Profile Avatar</h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Choose a color for your avatar
                                </p>
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                                <Palette size={16} className="inline mr-2" />
                                Avatar Color
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {AVATAR_GRADIENTS.map((gradient, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedGradient(index)}
                                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} transition-all transform hover:scale-110 ${
                                            selectedGradient === index
                                                ? 'ring-4 ring-primary-500 ring-offset-2 dark:ring-offset-neutral-800'
                                                : 'hover:ring-2 ring-neutral-300'
                                        }`}
                                        title={`Color ${index + 1}`}
                                    />
                                ))}
                            </div>
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
                            placeholder="Enter your display name"
                            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl 
                               focus:ring-2 focus:ring-primary-200 focus:border-primary-500 
                               transition-all outline-none bg-white dark:bg-neutral-700
                               text-neutral-900 dark:text-white"
                        />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            This name will be displayed throughout the app
                        </p>
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                            <Mail size={16} className="inline mr-2" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={user.email || ''}
                            disabled
                            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl 
                               bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400
                               cursor-not-allowed"
                        />
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            Email cannot be changed
                        </p>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            className={`
                                flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white
                                transition-all duration-300 transform active:scale-95
                                disabled:opacity-70 disabled:cursor-not-allowed
                                ${hasChanges
                                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700'
                                    : 'bg-neutral-400 dark:bg-neutral-600'
                                }
                            `}
                        >
                            {saving ? (
                                <>
                                    <Loader size={20} className="animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    <span>{hasChanges ? 'Save Changes' : 'No Changes'}</span>
                                </>
                            )}
                        </button>
                    </div>

                    {hasChanges && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
                            <AlertCircle size={14} />
                            You have unsaved changes
                        </p>
                    )}
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
                            <option value="EUR">EUR (€)</option>
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
                    {/* Export Options */}
                    <div className="p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
                        <h3 className="font-medium text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                            <Download size={18} />
                            Export Your Data
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                            Download all your transaction data in your preferred format
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <button
                                onClick={() => handleExport('json')}
                                disabled={exporting}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 
                                         text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {exporting ? (
                                    <Loader size={16} className="animate-spin" />
                                ) : (
                                    <FileJson size={16} />
                                )}
                                <span className="text-sm font-medium">JSON</span>
                            </button>
                            <button
                                onClick={() => handleExport('csv')}
                                disabled={exporting}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 
                                         text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {exporting ? (
                                    <Loader size={16} className="animate-spin" />
                                ) : (
                                    <File size={16} />
                                )}
                                <span className="text-sm font-medium">CSV</span>
                            </button>
                            <button
                                onClick={() => handleExport('excel')}
                                disabled={exporting}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 
                                         text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {exporting ? (
                                    <Loader size={16} className="animate-spin" />
                                ) : (
                                    <FileSpreadsheet size={16} />
                                )}
                                <span className="text-sm font-medium">Excel</span>
                            </button>
                        </div>
                    </div>

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
