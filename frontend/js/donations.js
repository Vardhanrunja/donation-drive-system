// Load donation stats for donor dashboard
async function loadDonationStats() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://donation-drive-system.onrender.com//api/donations/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const stats = await response.json();
            document.getElementById('totalDonations').textContent = stats.totalDonations;
            document.getElementById('pendingDonations').textContent = stats.pendingDonations;
            document.getElementById('completedDonations').textContent = stats.completedDonations;
        }
    } catch (error) {
        console.error('Error loading donation stats:', error);
    }
}

async function loadNGORecentDonations() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://donation-drive-system.onrender.com//api/donations/ngo', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const donations = await response.json();
            const donationsList = document.getElementById('recentDonations');

            if (!donations || donations.length === 0) return;

            donationsList.innerHTML = ''; // Clear "no donations" message
            const recent = donations.slice(0, 5); // Show top 5
            recent.forEach(donation => {
                const item = createDonationItem(donation, true);
                donationsList.appendChild(item);
            });
        }
    } catch (error) {
        console.error('Error loading NGO recent donations:', error);
    }
}

// Load recent donations for donor dashboard
async function loadRecentDonations() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://donation-drive-system.onrender.com//api/donations/recent', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const donations = await response.json();
            const donationsList = document.getElementById('recentDonations');
            
            if (donations.length === 0) {
                return; // Keep the empty message
            }
            
            donationsList.innerHTML = '';
            donations.forEach(donation => {
                const donationItem = createDonationItem(donation);
                donationsList.appendChild(donationItem);
            });
        }
    } catch (error) {
        console.error('Error loading recent donations:', error);
    }
}

// Load donation stats for NGO dashboard
async function loadNGODonationStats() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://donation-drive-system.onrender.com//api/donations/ngo-stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const stats = await response.json();
            document.getElementById('pendingCount').textContent = stats.pendingRequests;
            document.getElementById('approvedCount').textContent = stats.totalReceived; // Or split this up if needed
            document.getElementById('deliveredCount').textContent = stats.completedDonations;
            document.getElementById('collectedCount').textContent = stats.collectedCount;
            // Add collectedCount if needed
        }
    } catch (error) {
        console.error('Error loading NGO donation stats:', error);
    }
}


// Load available donations for NGO dashboard
// async function loadAvailableDonations() {
//     try {
//         const token = localStorage.getItem('token');
//         const response = await fetch('https://donation-drive-system.onrender.com//api/donations/avilable', {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });
        
//         if (response.ok) {
//             const donations = await response.json();
//             const donationsList = document.getElementById('availableDonations');
            
//             if (donations.length === 0) {
//                 return; // Keep the empty message
//             }
            
//             donationsList.innerHTML = '';
//             donations.forEach(donation => {
//                 const donationItem = createDonationItem(donation, true);
//                 donationsList.appendChild(donationItem);
//             });
//         }
//     } catch (error) {
//         console.error('Error loading available donations:', error);
//     }
// }

// Load donations for donations list page
// async function loadDonations() {
//     try {
//         const token = localStorage.getItem('token');
//         const user = JSON.parse(localStorage.getItem('user'));
        
//         // Get filters
//         const statusFilter = document.getElementById('statusFilter').value;
//         const typeFilter = document.getElementById('typeFilter').value;
        
//         let url = 'https://donation-drive-system.onrender.com//api/donations';
//         if (user.userType === 'ngo') {
//             url += '/ngo';
//         } else {
//             url += '/donor';
//         }
        
//         // Add filters to URL
//         const params = new URLSearchParams();
//         if (statusFilter !== 'all') params.append('status', statusFilter);
//         if (typeFilter !== 'all') params.append('type', typeFilter);
        
//         if (params.toString()) {
//             url += `?${params.toString()}`;
//         }
        
//         const response = await fetch(url, {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         });
        
//         if (response.ok) {
//             const donations = await response.json();
//             const donationsList = document.getElementById('donationsList');
            
//             if (donations.length === 0) {
//                 donationsList.innerHTML = '<p class="empty-message">No donations found matching your criteria.</p>';
//                 return;
//             }
            
//             donationsList.innerHTML = '';
//             donations.forEach(donation => {
//                 const donationItem = createDonationItem(donation, user.userType === 'ngo');
//                 donationsList.appendChild(donationItem);
//             });
//         }
//     } catch (error) {
//         console.error('Error loading donations:', error);
//     }
// }
async function loadDonations() {
    try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        // const statusFilter = document.getElementById('statusFilter').value;
        // const typeFilter = document.getElementById('typeFilter').value;

        const donationsList = document.getElementById('donationsList');

        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        
        if (user.userType === 'ngo') {
            // Fetch assigned donations (donations assigned to this NGO)
            const assignedUrl = 'https://donation-drive-system.onrender.com//api/donations/ngo';
            // Fetch available donations (donations available for NGO)
            const availableUrl = 'https://donation-drive-system.onrender.com//api/donations/available';

            // Build query params for filters, e.g. "?status=pending&type=food"
            // const params = new URLSearchParams();
            // if (statusFilter !== 'all') params.append('status', statusFilter);
            // if (typeFilter !== 'all') params.append('type', typeFilter);

            // Append query params if any
            let assignedFetchUrl = assignedUrl;
            let availableFetchUrl = availableUrl;
            // if (params.toString()) {
            //     assignedFetchUrl += `?${params.toString()}`;
            //     availableFetchUrl += `?${params.toString()}`;
            // }

            // Fetch both sets simultaneously:
            const [assignedResp, availableResp] = await Promise.all([
                fetch(assignedFetchUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(availableFetchUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
            ]);

            if (!assignedResp.ok || !availableResp.ok) {
                donationsList.innerHTML = '<p class="empty-message">Failed to load donations. Please try again later.</p>';
                return;
            }

            const assignedDonations = await assignedResp.json();
            const availableDonations = await availableResp.json();

            // Combine donations - avoiding duplicates, if your data has unique _id field:
            const combinedMap = new Map();

            assignedDonations.forEach(d => combinedMap.set(d._id, d));
            availableDonations.forEach(d => {
                if (!combinedMap.has(d._id)) {
                    combinedMap.set(d._id, d);
                }
            });

            const combinedDonations = Array.from(combinedMap.values());

            if (combinedDonations.length === 0) {
                donationsList.innerHTML = '<p class="empty-message">No donations found matching your criteria.</p>';
                return;
            }

            // Clear and render combined list
            donationsList.innerHTML = '';
            combinedDonations.forEach(donation => {
                const donationItem = createDonationItem(donation, true);
                donationsList.appendChild(donationItem);
            });

        } else {
            // For donors, load from donor route as before:
            let url = 'https://donation-drive-system.onrender.com//api/donations/donor';
            // const params = new URLSearchParams();
            // if (statusFilter !== 'all') params.append('status', statusFilter);
            // if (typeFilter !== 'all') params.append('type', typeFilter);
            // if (params.toString()) {
            //     url += `?${params.toString()}`;
            // }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                donationsList.innerHTML = '<p class="empty-message">Failed to load donations. Please try again later.</p>';
                return;
            }

            const donations = await response.json();
            if (donations.length === 0) {
                donationsList.innerHTML = '<p class="empty-message">No donations found matching your criteria.</p>';
                return;
            }
            donationsList.innerHTML = '';
            donations.forEach(donation => {
                const donationItem = createDonationItem(donation, false);
                donationsList.appendChild(donationItem);
            });
        }
    } catch (error) {
        console.error('Error loading donations:', error);
        document.getElementById('donationsList').innerHTML = '<p class="empty-message">Error loading donations. Check console.</p>';
    }
}

// Create a donation item element
// function createDonationItem(donation, isNGOView = false) {
//     const donationItem = document.createElement('div');
//     donationItem.className = 'donation-item';
    
//     const donationInfo = document.createElement('div');
//     donationInfo.className = 'donation-info';
    
//     const title = document.createElement('h3');
//     title.textContent = donation.itemName;
//     donationInfo.appendChild(title);
    
//     const description = document.createElement('p');
//     description.textContent = donation.description || 'No description provided';
//     donationInfo.appendChild(description);
    
//     const meta = document.createElement('div');
//     meta.className = 'donation-meta';
    
//     const quantity = document.createElement('span');
//     quantity.textContent = `Quantity: ${donation.quantity}`;
//     meta.appendChild(quantity);
    
//     const type = document.createElement('span');
//     type.textContent = `Type: ${donation.itemType}`;
//     meta.appendChild(type);
    
//     if (!isNGOView) {
//         const status = document.createElement('span');
//         status.textContent = `Status: ${donation.status}`;
//         meta.appendChild(status);
//     }
    
//     donationInfo.appendChild(meta);
//     donationItem.appendChild(donationInfo);
    
//     const statusBadge = document.createElement('span');
//     statusBadge.className = `donation-status status-${donation.status.toLowerCase()}`;
//     statusBadge.textContent = donation.status;
//     donationItem.appendChild(statusBadge);
    
//     if (isNGOView && donation.status === 'pending') {
//         const actions = document.createElement('div');
//         actions.className = 'donation-actions';
//         const statusSelect = document.createElement('select');
//         statusSelect.className = 'status-dropdown';
//         STATUSES.forEach(s => {
//             const option = document.createElement('option');
//             option.value = s;
//             option.textContent = s.charAt(0).toUpperCase() + s.slice(1);
//             if (donation.status === s) option.selected = true;
//             statusSelect.appendChild(option);
//         });
//         statusSelect.addEventListener('change', function () {
//             // Confirm, then update
//             if (confirm(`Update status to "${this.value}"?`)) {
//                 updateDonationStatus(donation._id, this.value);
//             } else {
//                 // If cancelled, revert
//                 this.value = donation.status;
//             }
//         });
//         statusArea.appendChild(statusSelect);
//         const approveBtn = document.createElement('button');
//         approveBtn.className = 'btn';
//         approveBtn.textContent = 'Approve';
//         approveBtn.addEventListener('click', () => updateDonationStatus(donation._id, 'approved'));
//         actions.appendChild(approveBtn);
        
//         const rejectBtn = document.createElement('button');
//         rejectBtn.className = 'btn btn-outline';
//         rejectBtn.textContent = 'Reject';
//         rejectBtn.addEventListener('click', () => updateDonationStatus(donation._id, 'rejected'));
//         actions.appendChild(rejectBtn);
        
//         donationItem.appendChild(actions);
//     }
    
//     return donationItem;
// }
// Utility: available statuses

const STATUSES = ['pending', 'approved', 'rejected', 'collected', 'delivered'];

function createDonationItem(donation, isNGOView = false) {
    const donationItem = document.createElement('div');
    donationItem.className = 'donation-item';

    // Donation Info
    const donationInfo = document.createElement('div');
    donationInfo.className = 'donation-info';

    const title = document.createElement('h3');
    title.textContent = donation.itemName;
    donationInfo.appendChild(title);

    const description = document.createElement('p');
    description.textContent = donation.description || 'No description provided';
    donationInfo.appendChild(description);

    const meta = document.createElement('div');
    meta.className = 'donation-meta';

    const quantity = document.createElement('span');
    quantity.textContent = `Quantity: ${donation.quantity}`;
    meta.appendChild(quantity);

    const type = document.createElement('span');
    type.textContent = `Type: ${donation.itemType}`;
    meta.appendChild(type);

    const pickupAddress = document.createElement('p');
    pickupAddress.textContent = donation.pickupAddress;
    donationInfo.appendChild(pickupAddress);
    pickupAddress.textContent=`Pickup Address: ${donation.pickupAddress}`;

    const pickupDateTime = document.createElement('p');
const formattedDate = new Date(donation.pickupDateTime).toLocaleString();
pickupDateTime.textContent = ` Date and Time: ${formattedDate}`;
donationInfo.appendChild(pickupDateTime);


    donationInfo.appendChild(meta);
    donationItem.appendChild(donationInfo);

    // Status display and status update dropdown (for NGOs)
    const statusArea = document.createElement('div');
    statusArea.className = 'donation-status-area';

    if (isNGOView) {
        // Show status select (dropdown) for all donations
        const statusSelect = document.createElement('select');
        statusSelect.className = 'status-dropdown';
        STATUSES.forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            if (donation.status === status) option.selected = true;
            statusSelect.appendChild(option);
        });
        statusSelect.addEventListener('change', function () {
            if (this.value !== donation.status) {
                if (confirm(`Update status to "${this.value}"?`)) {
                    updateDonationStatus(donation._id, this.value);
                } else {
                    this.value = donation.status; // revert if cancelled
                }
            }
        });
        statusArea.appendChild(statusSelect);
    } else {
        // For donors, just show status as text
        const statusLabel = document.createElement('span');
        statusLabel.textContent = `Status: ${donation.status}`;
        statusArea.appendChild(statusLabel);
    }

    donationItem.appendChild(statusArea);

    return donationItem;
}


// Update donation status (for NGO)
async function updateDonationStatus(donationId, status) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://donation-drive-system.onrender.com/api/donations/update-status/${donationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            alert('Donation status updated successfully');
            // loadAvailableDonations();
            loadDonations();
        } else {
            const result = await response.json();
            alert(result.message || 'Failed to update donation status');
        }
    } catch (error) {
        console.error('Error updating donation status:', error);
        alert('An error occurred while updating donation status');
    }
}

// Handle donation form submission
document.addEventListener('DOMContentLoaded', () => {
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        donationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(donationForm);
            const data = Object.fromEntries(formData.entries());
            
            // Add pickup datetime
            data.pickupDateTime = new Date(`${data.preferredDate}T${data.preferredTime}`).toISOString();
            
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('https://donation-drive-system.onrender.com/api/donations/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    alert('Donation submitted successfully!');
                    window.location.href = 'donations-list.html';
                } else {
                    alert(result.message || 'Donation submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during donation submission');
            }
        });
    }
});