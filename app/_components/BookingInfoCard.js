
function BookingInfoCard({ icon: Icon, title, desc }) {
  

  return (
    <div className="bg-emerald-800/20 border border-emerald-700/50 p-2 rounded-xl flex items-start gap-3 hover:bg-emerald-800 hover:border-green-500/30 transition-colors group cursor-default">
      <div className="p-2.5 bg-emerald-950 rounded-lg group-hover:bg-green-500/20 transition-colors">
        <Icon className="w-5 h-5 text-emerald-100 group-hover:text-emerald-300" />
      </div>
      <div>
        <h3 className="font-semibold text-emerald-900 text-sm">{title}</h3>
        <p className="text-emerald-900 text-xs">{desc}</p>
      </div>
    </div>
  );
}

export default BookingInfoCard;