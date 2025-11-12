import React, { useEffect, useMemo, useState } from "react";



type Program = {
    id: string;
    name: string;
    students: number;
    startDate: string;
    endDate: string;
    status: "Đang tuyển" | "Đang học" | "Đã kết thúc";
};

const mockPrograms: Program[] = [
    { id: "P001", name: "Kỹ năng lập trình React", students: 42, startDate: "2025-02-01", endDate: "2025-05-30", status: "Đang học" },
    { id: "P002", name: "Quản lý đào tạo nội bộ", students: 18, startDate: "2025-03-15", endDate: "2025-04-30", status: "Đang tuyển" },
    { id: "P003", name: "Chuẩn đầu ra và đánh giá", students: 12, startDate: "2024-10-01", endDate: "2024-12-20", status: "Đã kết thúc" },
];

const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 8,
    padding: 16,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
};

const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
};

const smallMuted: React.CSSProperties = { color: "#666", fontSize: 13 };

const PhongDaoTao: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("Tất cả");

    useEffect(() => {
        // TODO: replace this mock load with real API call, e.g. fetch('/api/phong-daotao/programs')
        setLoading(true);
        const t = setTimeout(() => {
            setPrograms(mockPrograms);
            setLoading(false);
        }, 400);
        return () => clearTimeout(t);
    }, []);

    const stats = useMemo(() => {
        const totalPrograms = programs.length;
        const totalStudents = programs.reduce((s, p) => s + p.students, 0);
        const ongoing = programs.filter((p) => p.status === "Đang học").length;
        return { totalPrograms, totalStudents, ongoing };
    }, [programs]);

    const filtered = useMemo(() => {
        return programs.filter((p) => {
            if (selectedStatus !== "Tất cả" && p.status !== selectedStatus) return false;
            if (!query) return true;
            return (
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.id.toLowerCase().includes(query.toLowerCase())
            );
        });
    }, [programs, query, selectedStatus]);

    const onQuickCreate = () => {
        // Quick create stub - replace with modal or route navigation
        const newProgram: Program = {
            id: `P${Math.floor(Math.random() * 900 + 100)}`,
            name: "Chương trình mới",
            students: 0,
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date().toISOString().slice(0, 10),
            status: "Đang tuyển",
        };
        setPrograms((prev) => [newProgram, ...prev]);
    };

    return (
        <div style={{ padding: 20, fontFamily: "Inter, Roboto, sans-serif", minHeight: "100%" }}>
            <div style={headerStyle}>
                <div>
                    <h2 style={{ margin: 0 }}>Dashboard — Phòng Đào Tạo</h2>
                    <div style={smallMuted}>Tổng quan hoạt động và quản lý chương trình</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <input
                        aria-label="Tìm kiếm"
                        placeholder="Tìm kiếm chương trình hoặc mã..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #ddd", minWidth: 220 }}
                    />
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #ddd" }}
                    >
                        <option>Tất cả</option>
                        <option>Đang tuyển</option>
                        <option>Đang học</option>
                        <option>Đã kết thúc</option>
                    </select>
                    <button onClick={onQuickCreate} style={{ padding: "8px 12px", borderRadius: 6, border: "none", background: "#1677ff", color: "#fff" }}>
                        Tạo nhanh
                    </button>
                </div>
            </div>

            <div style={gridStyle}>
                <div style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <div style={{ color: "#888", fontSize: 13 }}>Chương trình</div>
                            <div style={{ fontSize: 28, fontWeight: 600 }}>{stats.totalPrograms}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ color: "#888", fontSize: 13 }}>Sinh viên</div>
                            <div style={{ fontSize: 20, fontWeight: 600 }}>{stats.totalStudents}</div>
                        </div>
                    </div>
                    <div style={{ marginTop: 12, color: "#44a55e" }}>Đang học: {stats.ongoing}</div>
                </div>

                <div style={cardStyle}>
                    <div style={{ color: "#888", fontSize: 13 }}>Hoạt động gần đây</div>
                    <ul style={{ marginTop: 12, paddingLeft: 16 }}>
                        <li>Đã cập nhật kết quả học tập: Khoa CNTT</li>
                        <li>Open đăng ký học phần mới cho học kỳ 2025-1</li>
                        <li>Đã xuất báo cáo thống kê tháng 10</li>
                    </ul>
                </div>

                <div style={cardStyle}>
                    <div style={{ color: "#888", fontSize: 13 }}>Biểu đồ tuyển sinh (tối giản)</div>
                    <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "end", height: 80 }}>
                        {programs.map((p) => {
                            const h = Math.min(80, 10 + p.students);
                            return (
                                <div key={p.id} title={`${p.name}: ${p.students}`} style={{ width: 24, background: "#1677ff", height: h, borderRadius: 4 }} />
                            );
                        })}
                        {programs.length === 0 && <div style={smallMuted}>Không có dữ liệu</div>}
                    </div>
                </div>

                <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ fontWeight: 600 }}>Danh sách chương trình</div>
                        <div style={smallMuted}>{loading ? "Đang tải..." : `${filtered.length} kết quả`}</div>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ textAlign: "left", color: "#555" }}>
                                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>Mã</th>
                                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>Tên chương trình</th>
                                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>Số sinh viên</th>
                                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>Thời gian</th>
                                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}>Trạng thái</th>
                                    <th style={{ padding: "8px 6px", borderBottom: "1px solid #eee" }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={6} style={{ padding: 12, color: "#888" }}>
                                            Đang tải dữ liệu...
                                        </td>
                                    </tr>
                                )}
                                {!loading && filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ padding: 12, color: "#888" }}>
                                            Không tìm thấy chương trình
                                        </td>
                                    </tr>
                                )}
                                {!loading &&
                                    filtered.map((p) => (
                                        <tr key={p.id} style={{ borderTop: "1px solid #fafafa" }}>
                                            <td style={{ padding: "10px 6px", verticalAlign: "middle", width: 100 }}>{p.id}</td>
                                            <td style={{ padding: "10px 6px", verticalAlign: "middle" }}>{p.name}</td>
                                            <td style={{ padding: "10px 6px", verticalAlign: "middle", width: 120 }}>{p.students}</td>
                                            <td style={{ padding: "10px 6px", verticalAlign: "middle", width: 200 }}>
                                                {p.startDate} → {p.endDate}
                                            </td>
                                            <td style={{ padding: "10px 6px", verticalAlign: "middle", width: 140 }}>
                                                <span
                                                    style={{
                                                        padding: "4px 8px",
                                                        borderRadius: 16,
                                                        background: p.status === "Đang học" ? "#e6f7ff" : p.status === "Đang tuyển" ? "#fff7e6" : "#f5f5f5",
                                                        color: "#333",
                                                        fontSize: 13,
                                                    }}
                                                >
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: "10px 6px", verticalAlign: "middle", width: 140 }}>
                                                <button
                                                    onClick={() => alert(`Mở chi tiết ${p.id}`)}
                                                    style={{ marginRight: 8, padding: "6px 8px", borderRadius: 6, border: "1px solid #ddd", background: "#fff" }}
                                                >
                                                    Chi tiết
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setPrograms((prev) => prev.filter((x) => x.id !== p.id))
                                                    }
                                                    style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #f5c6cb", background: "#fff" }}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: 20, color: "#999", fontSize: 13 }}>
                Ghi chú: Đây là giao diện demo. Thay thế dữ liệu mẫu bằng API thật khi tích hợp.
            </div>
        </div>
    );
};

export default PhongDaoTao;