// ============================================================
// PAGE: Campaign Calculator (Comparison)
// ============================================================

import React from 'react';
import { Plus, X, Award, Zap } from 'lucide-react';

const CampaignCalculator: React.FC = () => {
    return (
        <div className="page animate-in">
            {/* Warning Banner */}
            <div style={{
                background: 'rgba(255, 171, 0, 0.05)',
                border: '1px solid rgba(255, 171, 0, 0.2)',
                borderRadius: 12,
                padding: '16px 20px',
                marginBottom: 24,
                display: 'flex',
                gap: 12,
                alignItems: 'center'
            }}>
                <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#ffab00',
                    boxShadow: '0 0 10px #ffab00'
                }} />
                <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#ffab00' }}>Directional only</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        Based on 26 past events · best for comparing campaigns, not forecasting
                    </div>
                </div>
            </div>

            {/* Campaign Input Section */}
            <div className="grid-2 mb-24">
                {/* Campaign A */}
                <div className="card" style={{ borderTop: '4px solid var(--chart-1)' }}>
                    <div className="card-body" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--chart-1)', borderBottom: '2px solid var(--chart-1)', paddingBottom: 4 }}>
                                Campaign A
                            </div>
                            <button className="btn btn-sm btn-secondary" style={{ color: 'var(--red)', fontSize: 11 }}>Remove</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 60px 30px', gap: 10, marginBottom: 8, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', paddingLeft: 8 }}>
                            <div>UNI</div>
                            <div>TYPE</div>
                            <div>MONTH</div>
                            <div>QTY</div>
                            <div />
                        </div>

                        {[
                            { uni: 'NCL', type: 'Workshop', month: 'Nov', qty: 2 },
                            { uni: 'DUR', type: 'Hackathon', month: 'Oct', qty: 1 },
                            { uni: 'SUN', type: 'Career Fair', month: 'Jan', qty: 1 },
                        ].map((row, i) => (
                            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 60px 30px', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                                <select className="form-input" style={{ fontSize: 12, padding: '6px 10px' }}>
                                    <option>{row.uni}</option>
                                </select>
                                <select className="form-input" style={{ fontSize: 12, padding: '6px 10px' }}>
                                    <option>{row.type}</option>
                                </select>
                                <select className="form-input" style={{ fontSize: 12, padding: '6px 10px' }}>
                                    <option>{row.month}</option>
                                </select>
                                <input type="number" className="form-input" value={row.qty} readOnly style={{ fontSize: 12, padding: '6px 10px', textAlign: 'center' }} />
                                <button className="btn-icon" style={{ color: 'var(--red)', opacity: 0.6 }}><X size={14} /></button>
                            </div>
                        ))}

                        <button className="btn btn-secondary w-full" style={{ marginTop: 12, borderStyle: 'dashed', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--chart-1)' }}>
                            <Plus size={14} /> Add Event
                        </button>

                        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                            <div>4 events total</div>
                            <div style={{ fontWeight: 700, color: 'var(--text)' }}>Budget: <span style={{ color: 'var(--text-primary)' }}>£9,000</span></div>
                        </div>
                    </div>
                </div>

                {/* Campaign B */}
                <div className="card" style={{ borderTop: '4px solid var(--chart-2)' }}>
                    <div className="card-body" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--chart-2)', borderBottom: '2px solid var(--chart-2)', paddingBottom: 4 }}>
                                Campaign B
                            </div>
                            <button className="btn btn-sm btn-secondary" style={{ color: 'var(--red)', fontSize: 11 }}>Remove</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 60px 30px', gap: 10, marginBottom: 8, fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', paddingLeft: 8 }}>
                            <div>UNI</div>
                            <div>TYPE</div>
                            <div>MONTH</div>
                            <div>QTY</div>
                            <div />
                        </div>

                        {[
                            { uni: 'DUR', type: 'Case Study Evening', month: 'Nov', qty: 2 },
                            { uni: 'NTH', type: 'Workshop', month: 'Jan', qty: 2 },
                            { uni: 'TEE', type: 'Workshop', month: 'Feb', qty: 1 },
                        ].map((row, i) => (
                            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 60px 30px', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                                <select className="form-input" style={{ fontSize: 12, padding: '6px 10px' }}>
                                    <option>{row.uni}</option>
                                </select>
                                <select className="form-input" style={{ fontSize: 12, padding: '6px 10px' }}>
                                    <option>{row.type}</option>
                                </select>
                                <select className="form-input" style={{ fontSize: 12, padding: '6px 10px' }}>
                                    <option>{row.month}</option>
                                </select>
                                <input type="number" className="form-input" value={row.qty} readOnly style={{ fontSize: 12, padding: '6px 10px', textAlign: 'center' }} />
                                <button className="btn-icon" style={{ color: 'var(--red)', opacity: 0.6 }}><X size={14} /></button>
                            </div>
                        ))}

                        <button className="btn btn-secondary w-full" style={{ marginTop: 12, borderStyle: 'dashed', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--chart-2)' }}>
                            <Plus size={14} /> Add Event
                        </button>

                        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                            <div>5 events total</div>
                            <div style={{ fontWeight: 700, color: 'var(--text)' }}>Budget: <span style={{ color: 'var(--text-primary)' }}>£5,300</span></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Campaign Center Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <button className="btn btn-secondary" style={{ borderStyle: 'dashed', padding: '10px 30px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)' }}>
                    <Plus size={16} /> Add Campaign
                </button>
            </div>

            {/* Head-to-Head Comparison */}
            <div className="card">
                <div className="card-body" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>Head-to-Head Comparison</div>
                        <div style={{ padding: '2px 6px', borderRadius: 4, background: 'var(--chart-1)', color: '#fff', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>MODEL</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 30 }}>
                        Campaigns compared on two dimensions: predicted yield (which plan produces more) and efficiency (which plan is smarter per £ spent). Bars are relative — the longest bar is the best performer on that dimension.
                    </div>

                    {/* Compare A */}
                    <div style={{ marginBottom: 32 }}>
                        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                            <div style={{ width: 4, background: 'var(--chart-1)', borderRadius: 2 }} />
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 700 }}>Campaign A</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>3 event types · 4 total events · £9,000 budget</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 100, fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>Predicted yield</div>
                                <div style={{ flex: 1, height: 16, background: 'rgba(161, 0, 255, 0.1)', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg, var(--chart-1), #c060ff)' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 100, fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>Yield per £1k</div>
                                <div style={{ flex: 1, height: 16, background: 'rgba(161, 0, 255, 0.1)', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ width: '45%', height: '100%', background: 'linear-gradient(90deg, var(--chart-1), #c060ff)', opacity: 0.7 }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compare B */}
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <div style={{ width: 4, background: 'var(--chart-2)', borderRadius: 2 }} />
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 700 }}>Campaign B</div>
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>3 event types · 5 total events · £5,300 budget</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <div style={{ padding: '4px 10px', borderRadius: 20, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: 'var(--green)', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Award size={12} /> Highest Yield
                                </div>
                                <div style={{ padding: '4px 10px', borderRadius: 20, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', color: '#f59e0b', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Zap size={12} /> Most Efficient
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 100, fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>Predicted yield</div>
                                <div style={{ flex: 1, height: 16, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, var(--chart-2), #34d399)' }} />
                                    <div style={{ position: 'absolute', right: 8, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>strongest</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 100, fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>Yield per £1k</div>
                                <div style={{ flex: 1, height: 16, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, var(--chart-2), #34d399)' }} />
                                    <div style={{ position: 'absolute', right: 8, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>strongest</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Verdict */}
                    <div style={{
                        marginTop: 32,
                        padding: '16px 20px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--border)',
                        borderRadius: 12,
                        fontSize: 13,
                        lineHeight: 1.6,
                    }}>
                        <span style={{ color: 'var(--green)', fontWeight: 700 }}>Campaign B</span> leads on both predicted yield and budget efficiency. The model directionally favours this campaign — though the margin matters. If the bars are close, the difference may not be meaningful given model uncertainty.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignCalculator;
