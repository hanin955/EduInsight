import { useEffect, useRef, useState } from 'react';
import { FileText, Upload, Trash2, Download } from 'lucide-react';
import {
    listMyDocuments,
    uploadDocument,
    uploadSharedDocument,
    listMySharedDocuments,
    listSharedDocumentsForStudent,
    deleteDocument,
    getDocumentUrl,
} from '../../components/hooks/documentService';

const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

function DocumentList({ documents, canDelete, onDelete, emptyLabel }) {
    if (documents.length === 0) {
        return <div className="px-6 py-8 text-center text-sm text-slate-400">{emptyLabel}</div>;
    }
    return (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {documents.map((doc) => (
                <li key={doc._id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <FileText size={20} className="text-indigo-500" />
                        <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{doc.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {doc.fileType?.toUpperCase()} · {formatSize(doc.fileSize)}
                                {doc.owner?.firstName && ` · par ${doc.owner.firstName} ${doc.owner.lastName}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={getDocumentUrl(doc.fileName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-indigo-600"
                            title="Télécharger"
                        >
                            <Download size={18} />
                        </a>
                        {canDelete && (
                            <button
                                onClick={() => onDelete(doc._id)}
                                className="text-slate-400 hover:text-red-600"
                                title="Supprimer"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default function DocsPage() {
    const currentUser = (() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    })();
    const role = currentUser?.role;
    const isStudent = role === 'student';
    const isAdminOrTeacher = role === 'admin' || role === 'teacher';

    const [myDocs, setMyDocs] = useState([]);
    const [sharedDocs, setSharedDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadingMy, setUploadingMy] = useState(false);
    const [uploadingShared, setUploadingShared] = useState(false);
    const myFileInputRef = useRef(null);
    const sharedFileInputRef = useRef(null);

    const loadAll = async () => {
        try {
            setLoading(true);
            if (isStudent) {
                const shared = await listSharedDocumentsForStudent();
                setSharedDocs(shared);
            } else {
                const [mine, shared] = await Promise.all([listMyDocuments(), listMySharedDocuments()]);
                setMyDocs(mine);
                setSharedDocs(shared);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    const handleMyUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingMy(true);
            await uploadDocument(file, file.name);
            await loadAll();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setUploadingMy(false);
            e.target.value = '';
        }
    };

    const handleSharedUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingShared(true);
            await uploadSharedDocument(file, file.name);
            await loadAll();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        } finally {
            setUploadingShared(false);
            e.target.value = '';
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce document ?')) return;
        try {
            await deleteDocument(id);
            setMyDocs((prev) => prev.filter((d) => d._id !== id));
            setSharedDocs((prev) => prev.filter((d) => d._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {isStudent ? 'Documents partagés' : 'Mes documents partagés'}
                    </h2>
                    {isAdminOrTeacher && (
                        <>
                            <button
                                onClick={() => sharedFileInputRef.current?.click()}
                                disabled={uploadingShared}
                                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                            >
                                <Upload size={16} />
                                {uploadingShared ? 'Envoi en cours...' : 'Partager un document'}
                            </button>
                            <input ref={sharedFileInputRef} type="file" className="hidden" onChange={handleSharedUpload} />
                        </>
                    )}
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    {loading ? (
                        <div className="px-6 py-8 text-center text-sm text-slate-400">Chargement...</div>
                    ) : (
                        <DocumentList
                            documents={sharedDocs}
                            canDelete={isAdminOrTeacher}
                            onDelete={handleDelete}
                            emptyLabel="Aucun document partagé pour le moment."
                        />
                    )}
                </div>
                {role === 'teacher' && (
                    <p className="mt-2 text-xs text-slate-400">
                        Vos documents partagés sont visibles uniquement par les étudiants inscrits à vos cours.
                    </p>
                )}
                {role === 'admin' && (
                    <p className="mt-2 text-xs text-slate-400">
                        Vos documents partagés sont visibles par tous les étudiants.
                    </p>
                )}
            </div>
        </div>

    );
}