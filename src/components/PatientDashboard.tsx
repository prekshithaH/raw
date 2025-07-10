import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Baby, 
  Calendar, 
  Plus, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Patient, HealthRecord, BloodPressureData, SugarLevelData, BabyMovementData } from '../types';

interface PatientDashboardProps {
  patient: Patient;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ patient }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddRecord, setShowAddRecord] = useState<string | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);

  // Form states
  const [bloodPressureForm, setBloodPressureForm] = useState({
    systolic: '',
    diastolic: '',
    heartRate: '',
    notes: ''
  });

  const [sugarLevelForm, setSugarLevelForm] = useState({
    level: '',
    testType: 'random' as 'fasting' | 'random' | 'post_meal',
    notes: ''
  });

  const [babyMovementForm, setBabyMovementForm] = useState({
    count: '',
    duration: '',
    notes: ''
  });

  // Load health records from localStorage
  useEffect(() => {
    const storedRecords = localStorage.getItem(`healthRecords_${patient.id}`);
    if (storedRecords) {
      setHealthRecords(JSON.parse(storedRecords));
    }
  }, [patient.id]);

  // Save health records to localStorage
  const saveHealthRecords = (records: HealthRecord[]) => {
    localStorage.setItem(`healthRecords_${patient.id}`, JSON.stringify(records));
    setHealthRecords(records);
  };

  const handleAddBloodPressure = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      patientId: patient.id,
      date: new Date().toISOString(),
      type: 'blood_pressure',
      data: {
        systolic: parseInt(bloodPressureForm.systolic),
        diastolic: parseInt(bloodPressureForm.diastolic),
        heartRate: parseInt(bloodPressureForm.heartRate),
        notes: bloodPressureForm.notes
      } as BloodPressureData
    };

    const updatedRecords = [newRecord, ...healthRecords];
    saveHealthRecords(updatedRecords);
    
    setBloodPressureForm({ systolic: '', diastolic: '', heartRate: '', notes: '' });
    setShowAddRecord(null);
  };

  const handleAddSugarLevel = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      patientId: patient.id,
      date: new Date().toISOString(),
      type: 'sugar_level',
      data: {
        level: parseFloat(sugarLevelForm.level),
        testType: sugarLevelForm.testType,
        notes: sugarLevelForm.notes
      } as SugarLevelData
    };

    const updatedRecords = [newRecord, ...healthRecords];
    saveHealthRecords(updatedRecords);
    
    setSugarLevelForm({ level: '', testType: 'random', notes: '' });
    setShowAddRecord(null);
  };

  const handleAddBabyMovement = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRecord: HealthRecord = {
      id: Date.now().toString(),
      patientId: patient.id,
      date: new Date().toISOString(),
      type: 'baby_movement',
      data: {
        count: parseInt(babyMovementForm.count),
        duration: parseInt(babyMovementForm.duration),
        notes: babyMovementForm.notes
      } as BabyMovementData
    };

    const updatedRecords = [newRecord, ...healthRecords];
    saveHealthRecords(updatedRecords);
    
    setBabyMovementForm({ count: '', duration: '', notes: '' });
    setShowAddRecord(null);
  };

  const calculateWeeksRemaining = () => {
    if (!patient.dueDate) return 0;
    const due = new Date(patient.dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
    return Math.max(0, diffWeeks);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Pregnancy Progress */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Pregnancy Progress</h3>
            <p className="text-pink-100">Week {patient.currentWeek || 0} of 40</p>
          </div>
          <Baby className="w-12 h-12 text-pink-200" />
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{Math.round(((patient.currentWeek || 0) / 40) * 100)}%</span>
          </div>
          <div className="w-full bg-pink-400 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((patient.currentWeek || 0) / 40) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-pink-200">Due Date</p>
            <p className="font-medium">{patient.dueDate || 'Not set'}</p>
          </div>
          <div>
            <p className="text-pink-200">Weeks Remaining</p>
            <p className="font-medium">{calculateWeeksRemaining()}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setShowAddRecord('blood_pressure')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <Heart className="w-8 h-8 text-red-500" />
            <Plus className="w-5 h-5 text-gray-400" />
          </div>
          <h4 className="font-medium text-gray-800 mb-1">Blood Pressure</h4>
          <p className="text-sm text-gray-600">Track your readings</p>
        </button>

        <button
          onClick={() => setShowAddRecord('sugar_level')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <Activity className="w-8 h-8 text-blue-500" />
            <Plus className="w-5 h-5 text-gray-400" />
          </div>
          <h4 className="font-medium text-gray-800 mb-1">Sugar Level</h4>
          <p className="text-sm text-gray-600">Monitor glucose</p>
        </button>

        <button
          onClick={() => setShowAddRecord('baby_movement')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <Baby className="w-8 h-8 text-green-500" />
            <Plus className="w-5 h-5 text-gray-400" />
          </div>
          <h4 className="font-medium text-gray-800 mb-1">Baby Movement</h4>
          <p className="text-sm text-gray-600">Count kicks</p>
        </button>
      </div>

      {/* Recent Records */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Health Records</h3>
          <button 
            onClick={() => setActiveTab('health')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View all
          </button>
        </div>
        
        {healthRecords.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No health records yet. Start tracking your health!</p>
        ) : (
          <div className="space-y-3">
            {healthRecords.slice(0, 3).map((record) => {
              const date = new Date(record.date).toLocaleDateString();
              let content = '';
              
              if (record.type === 'blood_pressure') {
                const data = record.data as BloodPressureData;
                content = `${data.systolic}/${data.diastolic} mmHg`;
              } else if (record.type === 'sugar_level') {
                const data = record.data as SugarLevelData;
                content = `${data.level} mg/dL (${data.testType})`;
              } else if (record.type === 'baby_movement') {
                const data = record.data as BabyMovementData;
                content = `${data.count} movements in ${data.duration} minutes`;
              }
              
              return (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      record.type === 'blood_pressure' ? 'bg-red-500' :
                      record.type === 'sugar_level' ? 'bg-blue-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-800 capitalize">
                        {record.type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-600">{content}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{date}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
        {patient.emergencyContacts && patient.emergencyContacts.length > 0 ? (
          <div className="space-y-3">
            {patient.emergencyContacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.relationship}</p>
                </div>
                <button className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm">
                  <Phone className="w-4 h-4" />
                  <span>{contact.phone}</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No emergency contacts added yet.</p>
        )}
      </div>
    </div>
  );

  const renderHealthTracking = () => (
    <div className="space-y-6">
      {/* Health Records List */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Health Records</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddRecord('blood_pressure')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
            >
              <Heart className="w-4 h-4" />
              <span>Blood Pressure</span>
            </button>
            <button
              onClick={() => setShowAddRecord('sugar_level')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>Sugar Level</span>
            </button>
            <button
              onClick={() => setShowAddRecord('baby_movement')}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
            >
              <Baby className="w-4 h-4" />
              <span>Baby Movement</span>
            </button>
          </div>
        </div>

        {healthRecords.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-800 mb-2">No Health Records Yet</h4>
            <p className="text-gray-600 mb-6">Start tracking your health by adding your first record</p>
          </div>
        ) : (
          <div className="space-y-4">
            {healthRecords.map((record) => {
              const date = new Date(record.date);
              const formattedDate = date.toLocaleDateString();
              const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              let content = '';
              let icon = null;
              
              if (record.type === 'blood_pressure') {
                const data = record.data as BloodPressureData;
                content = `${data.systolic}/${data.diastolic} mmHg`;
                if (data.heartRate) content += ` • HR: ${data.heartRate} bpm`;
                icon = <Heart className="w-5 h-5 text-red-500" />;
              } else if (record.type === 'sugar_level') {
                const data = record.data as SugarLevelData;
                content = `${data.level} mg/dL`;
                const testTypeLabel = data.testType === 'fasting' ? 'Fasting' : 
                                   data.testType === 'post_meal' ? 'Post-meal' : 'Random';
                content += ` (${testTypeLabel})`;
                icon = <Activity className="w-5 h-5 text-blue-500" />;
              } else if (record.type === 'baby_movement') {
                const data = record.data as BabyMovementData;
                content = `${data.count} movements in ${data.duration} minutes`;
                icon = <Baby className="w-5 h-5 text-green-500" />;
              }
              
              return (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {icon}
                      <div>
                        <h4 className="font-medium text-gray-800 capitalize mb-1">
                          {record.type.replace('_', ' ')}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">{content}</p>
                        <p className="text-xs text-gray-500">{formattedDate} at {formattedTime}</p>
                        {record.data.notes && (
                          <p className="text-xs text-gray-600 mt-2 italic">Note: {record.data.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'health':
        return renderHealthTracking();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, {patient.name}
          </h1>
          <p className="text-gray-600">
            Track your pregnancy journey and stay healthy
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6">
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'health'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Health Tracking
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'appointments'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'education'
                  ? 'bg-pink-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Education
            </button>
          </nav>
        </div>

        {renderContent()}

        {/* Add Record Modals */}
        {showAddRecord === 'blood_pressure' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Add Blood Pressure Reading</h3>
              <form onSubmit={handleAddBloodPressure} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Systolic (mmHg)
                    </label>
                    <input
                      type="number"
                      value={bloodPressureForm.systolic}
                      onChange={(e) => setBloodPressureForm({...bloodPressureForm, systolic: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="120"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Diastolic (mmHg)
                    </label>
                    <input
                      type="number"
                      value={bloodPressureForm.diastolic}
                      onChange={(e) => setBloodPressureForm({...bloodPressureForm, diastolic: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="80"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heart Rate (bpm) - Optional
                  </label>
                  <input
                    type="number"
                    value={bloodPressureForm.heartRate}
                    onChange={(e) => setBloodPressureForm({...bloodPressureForm, heartRate: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="72"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes - Optional
                  </label>
                  <textarea
                    value={bloodPressureForm.notes}
                    onChange={(e) => setBloodPressureForm({...bloodPressureForm, notes: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={2}
                    placeholder="Any additional notes..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddRecord(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    Save Reading
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddRecord === 'sugar_level' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Add Sugar Level Reading</h3>
              <form onSubmit={handleAddSugarLevel} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sugar Level (mg/dL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={sugarLevelForm.level}
                    onChange={(e) => setSugarLevelForm({...sugarLevelForm, level: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Type
                  </label>
                  <select
                    value={sugarLevelForm.testType}
                    onChange={(e) => setSugarLevelForm({...sugarLevelForm, testType: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="random">Random</option>
                    <option value="fasting">Fasting</option>
                    <option value="post_meal">Post-meal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes - Optional
                  </label>
                  <textarea
                    value={sugarLevelForm.notes}
                    onChange={(e) => setSugarLevelForm({...sugarLevelForm, notes: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Any additional notes..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddRecord(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    Save Reading
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAddRecord === 'baby_movement' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Add Baby Movement Record</h3>
              <form onSubmit={handleAddBabyMovement} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Movements
                  </label>
                  <input
                    type="number"
                    value={babyMovementForm.count}
                    onChange={(e) => setBabyMovementForm({...babyMovementForm, count: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={babyMovementForm.duration}
                    onChange={(e) => setBabyMovementForm({...babyMovementForm, duration: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="60"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes - Optional
                  </label>
                  <textarea
                    value={babyMovementForm.notes}
                    onChange={(e) => setBabyMovementForm({...babyMovementForm, notes: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={2}
                    placeholder="Any additional notes..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddRecord(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;