// app/admin/page.tsx


const admin = () => {

    return (
        <div>
            <h2>this is admin</h2>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} text-white text-2xl p-3 rounded-full`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                <span className="text-gray-400 text-sm ml-2">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Activities</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                      ${activity.type === 'student' ? 'bg-blue-100 text-blue-600' : 
                        activity.type === 'teacher' ? 'bg-green-100 text-green-600' :
                        activity.type === 'assignment' ? 'bg-purple-100 text-purple-600' :
                        activity.type === 'exam' ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-600'}`}
                    >
                      {activity.user.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500">by {activity.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events - Takes 1 column */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Events</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/30 rounded-r-lg"
                >
                  <p className="text-sm font-medium text-gray-800">{event.title}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">📅 {event.date}</span>
                    <span className="text-xs text-gray-500">🕐 {event.time}</span>
                  </div>
                  <span className="text-xs text-blue-600 font-medium mt-1 inline-block">
                    {event.class}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Summary Section */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Today's Attendance Summary</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View Full Report →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {attendanceData.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.class}</span>
                  <span className="text-sm font-bold text-blue-600">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.percentage >= 90 ? 'bg-green-500' :
                      item.percentage >= 80 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {item.present} / {item.total} present
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}