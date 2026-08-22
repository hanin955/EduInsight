import { useEffect, useState } from 'react';
import { api } from '../../api/axios';
import { getErrorMessage } from '../../api/axios';
import AddDepartementModal from './AddDepartementModal';
import DepartementsTable from './DepartementsTable';

export default function DepartementsPage() {
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDepartement, setEditingDepartement] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const loadData = async (targetPage = page) => {
    try {
      setLoading(true);
      const response = await api.get('/departements/lister', { params: { page: targetPage, limit } });
      setDepartements(Array.isArray(response.data.departements) ? response.data.departements : []);
      setTotalPages(response.data.totalPages || 1);
      setPage(response.data.page || 1);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  const handleDepartementCreated = () => {
    loadData(page);
  };

  const handleDepartementUpdated = (updatedDep) => {
    setDepartements((prev) => prev.map((d) => (d._id === updatedDep._id ? updatedDep : d)));
  };

  const handleDelete = async (depId) => {
    if (!window.confirm('Supprimer ce département ?')) return;
    try {
      await api.delete(`/departements/${depId}`);
      loadData(page);
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const filteredDepartements = departements.filter((d) =>
    d.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrevious = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Rechercher un département..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
        <button
          onClick={() => setShowModal(true)}
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          + New Departement
        </button>
      </div>
      <DepartementsTable
        departements={filteredDepartements}
        loading={loading}
        error={error}
        onEditClick={setEditingDepartement}
        onDeleteClick={handleDelete}
      />
      {!loading && !error && (
        <div className="mt-4 flex items-center justify-between px-2">
          <button
            onClick={handlePrevious}
            disabled={page <= 1}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300"
          >
            Précédent
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page >= totalPages}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300"
          >
            Suivant
          </button>
        </div>
      )}
      {showModal && (
        <AddDepartementModal
          onClose={() => setShowModal(false)}
          onCreated={handleDepartementCreated}
        />
      )}
      {editingDepartement && (
        <AddDepartementModal
          departement={editingDepartement}
          onClose={() => setEditingDepartement(null)}
          onUpdated={handleDepartementUpdated}
        />
      )}
    </div>
  );
}