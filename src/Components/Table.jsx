import React from 'react';

const Table = () => {
  const tableData = [
    {
      department: 'Development',
      stage: 'UI Design',
      assigned: 'David',
      team: 'Mobile App',
      date: '12-09-2020',
      status: 'Pending',
    },
    {
      department: 'Testing',
      stage: 'Testing Phase',
      assigned: 'Mike',
      team: 'Web Dev',
      date: '12-09-2020',
      status: 'Done',
    },
    {
      department: 'Development',
      stage: 'UI Testing',
      assigned: 'Ghulam',
      team: 'UI Testing',
      date: '12-09-2020',
      status: 'Testing',
    },
    {
      department: 'Testing',
      stage: 'Testing Phase',
      assigned: 'Mike',
      team: 'Web Dev',
      date: '12-09-2020',
      status: 'Done',
    },
    {
      department: 'Development',
      stage: 'UI Testing',
      assigned: 'Ghulam',
      team: 'UI Testing',
      date: '12-09-2020',
      status: 'Testing',
    },
  ];

  return (
    <section className="mb-5 p-4">
      <table className="w-full bg-white rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left border-b">Department</th>
            <th className="p-3 text-left border-b">Stage</th>
            <th className="p-3 text-left border-b">Assigned</th>
            <th className="p-3 text-left border-b">Team</th>
            <th className="p-3 text-left border-b">Date</th>
            <th className="p-3 text-left border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr
              key={index}
              className={`${index % 2 === 0 ? 'bg-light' : 'bg-[#f3f6fd]'}`}>
              <td className="p-3 border-b">{row.department}</td>
              <td className="p-3 border-b">{row.stage}</td>
              <td className="p-3 border-b">{row.assigned}</td>
              <td className="p-3 border-b">{row.team}</td>
              <td className="p-3 border-b">{row.date}</td>
              <td className="p-3 border-b">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Table;
