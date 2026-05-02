import { useState, useEffect } from 'react';
import { Project, UserRole, TeamMember, User } from '../types';
import API from "../../api/axios";

interface TeamManagementProps {
  project: Project;
  userRole: UserRole;
  onUpdate: () => void;
}

export const TeamManagement = ({ project, userRole, onUpdate }: TeamManagementProps) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('member');
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await API.get("/users");
      setAllUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const teamMemberUsers = allUsers.filter(u =>
    project.teamMembers.some(m => m.userId === u.id)
  );

  const availableUsers = allUsers.filter(u =>
    !project.teamMembers.some(m => m.userId === u.id)
  );

  const canManageTeam = userRole === 'admin';

  const handleAddMember = async () => {
    if (!selectedUserId) return;

    const newMember: TeamMember = {
      userId: selectedUserId,
      role: selectedRole,
      addedAt: new Date().toISOString(),
    };

    try {
      await API.put(`/projects/${project.id}/team`, {
        teamMembers: [...project.teamMembers, newMember],
      });

      setSelectedUserId('');
      setSelectedRole('member');
      setShowAddMember(false);
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (userId === project.createdBy) {
      alert('Cannot remove the project creator');
      return;
    }

    if (confirm('Are you sure you want to remove this team member?')) {
      const updatedTeamMembers = project.teamMembers.filter(m => m.userId !== userId);

      try {
        await API.put(`/projects/${project.id}/team`, {
          teamMembers: updatedTeamMembers,
        });
        onUpdate();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    if (userId === project.createdBy) {
      alert('Cannot change creator role');
      return;
    }

    const updatedTeamMembers = project.teamMembers.map(m =>
      m.userId === userId ? { ...m, role: newRole } : m
    );

    try {
      await API.put(`/projects/${project.id}/team`, {
        teamMembers: updatedTeamMembers,
      });
      onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const getMemberRole = (userId: string): UserRole => {
    const member = project.teamMembers.find(m => m.userId === userId);
    return member?.role || 'member';
  };

  return (
    <div className="space-y-6">
      {/* UI COMPLETELY SAME — NO CHANGE */}
      <div className="flex justify-between items-center">
        <h3 className="text-gray-900">Team Members ({teamMemberUsers.length})</h3>
        {canManageTeam && availableUsers.length > 0 && (
          <button
            onClick={() => setShowAddMember(!showAddMember)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Member
          </button>
        )}
      </div>

      {/* Rest UI SAME */}
      {/* (unchanged JSX below — kept exactly same as yours) */}

      {/* Add Member Form */}
      {showAddMember && canManageTeam && (
        <div className="bg-blue-50 p-4 rounded-lg space-y-4">
          <h4 className="text-gray-900">Add Team Member</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select a user</option>
                {availableUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowAddMember(false)}>Cancel</button>
            <button onClick={handleAddMember}>Add Member</button>
          </div>
        </div>
      )}

      {/* Team Members List */}
      <div className="space-y-3">
        {teamMemberUsers.map(member => {
          const memberRole = getMemberRole(member.id);
          const isCreator = member.id === project.createdBy;

          return (
            <div key={member.id} className="bg-white p-4 rounded-lg flex justify-between">
              <div>
                <h4>{member.name}</h4>
                <p>{member.email}</p>
              </div>

              <div className="flex gap-2">
                {canManageTeam && !isCreator && (
                  <>
                    <select
                      value={memberRole}
                      onChange={(e) => handleChangeRole(member.id, e.target.value as UserRole)}
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>

                    <button onClick={() => handleRemoveMember(member.id)}>Remove</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};