import React from 'react'

function StatCard({ change, changeType = 'up', icon, iconColor, value, label, delay }) {
  return (
    <div className="stat-card" style={delay ? { animationDelay: delay } : {}}>
      {change && (
        <span className={`stat-change ${changeType}`}>
          {change}
        </span>
      )}
      <div className={`stat-icon ${iconColor}`}>{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default StatCard
