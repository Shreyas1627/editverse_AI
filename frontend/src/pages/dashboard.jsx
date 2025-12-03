import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Video, Clock, ArrowRight } from 'lucide-react'; // Ensure you have lucide-react installed

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Recent Projects
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Note: You need to implement GET /jobs/history in backend for this to work fully
        // For now, it might return 404 if you haven't added that endpoint yet.
        // We'll handle the error gracefully.
        const res = await axios.get('http://localhost:8000/jobs/history');
        setProjects(res.data);
      } catch (err) {
        console.log("Could not fetch history (API might be missing):", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-sans">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <button 
          onClick={() => {
             // When Harsh's code comes, this might open a modal. 
             // For now, it goes straight to the Editor for a new project.
             navigate('/editor'); 
          }}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={20} />
          New Project
        </button>
      </header>

      {/* Recent Projects Grid */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl text-gray-400 mb-6 flex items-center gap-2">
          <Clock size={18} /> Recent Projects
        </h2>

        {loading ? (
          <div className="text-gray-500">Loading projects...</div>
        ) : projects.length === 0 ? (
          // Empty State
          <div className="border border-dashed border-gray-800 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-6">Start your first video edit today.</p>
            <button 
              onClick={() => navigate('/editor')}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Create Project &rarr;
            </button>
          </div>
        ) : (
          // Projects List
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((job) => (
              <div key={job.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                    <Video size={20} className="text-blue-400" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    job.status === 'COMPLETED' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    {job.status}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-1 truncate">Project {job.id.slice(0, 8)}...</h3>
                <p className="text-gray-500 text-sm mb-6">{new Date(job.created_at).toLocaleDateString()}</p>
                
                <button 
                  onClick={() => navigate('/editor')} 
                  className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-600/10 group-hover:text-blue-400"
                >
                  Open Editor <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;