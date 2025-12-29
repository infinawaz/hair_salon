import { X, Printer, FileText, Calendar, User, Receipt } from 'lucide-react';

const InvoiceModal = ({ invoice, customer, items, onClose, onProceedToPayment }) => {
    const subtotal = items?.reduce((sum, i) => sum + i.price, 0) || 0;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card" style={{ width: '500px', maxHeight: '90vh', overflow: 'auto' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }}>
                            <Receipt size={20} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>Invoice #{invoice.id}</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                                {new Date(invoice.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div className="card-content" style={{ padding: '1.5rem' }}>
                    {/* Customer Info */}
                    {customer && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius)' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black' }}>
                                <User size={18} />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600' }}>{customer.name}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{customer.contactNo}</div>
                            </div>
                        </div>
                    )}

                    {/* Invoice Items */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--muted-foreground)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items</h4>
                        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                            {items?.map((item, index) => (
                                <div key={item.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 1rem',
                                    borderBottom: index < items.length - 1 ? '1px solid var(--glass-border)' : 'none'
                                }}>
                                    <div>
                                        <span style={{ fontWeight: '500' }}>{item.service?.name || item.product?.name}</span>
                                        <span style={{
                                            marginLeft: '0.5rem',
                                            fontSize: '0.7rem',
                                            padding: '0.15rem 0.4rem',
                                            borderRadius: '4px',
                                            background: item.type === 'SERVICE' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: item.type === 'SERVICE' ? '#3b82f6' : '#f59e0b'
                                        }}>
                                            {item.type}
                                        </span>
                                    </div>
                                    <span style={{ fontWeight: '600' }}>₹{item.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Invoice Summary */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius)', padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            <span style={{ color: 'var(--muted-foreground)' }}>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        {invoice.discount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#10b981' }}>
                                <span>Discount</span>
                                <span>-₹{invoice.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            <span style={{ color: 'var(--muted-foreground)' }}>Tax ({invoice.taxRate}%)</span>
                            <span>₹{invoice.tax.toFixed(2)}</span>
                        </div>
                        <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '0.75rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '700' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--primary)' }}>₹{invoice.total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                        <button
                            className="btn btn-secondary"
                            style={{ flex: 1 }}
                            onClick={handlePrint}
                        >
                            <Printer size={18} style={{ marginRight: '0.5rem' }} />
                            Print
                        </button>
                        <button
                            className="btn btn-primary"
                            style={{ flex: 1, backgroundColor: '#10b981', borderColor: '#10b981' }}
                            onClick={onProceedToPayment}
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
