import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BASE_URL } from '../../utils';

const ProfileAdmin = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        file: null,
    });

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axios.get(`${BASE_URL}/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const { username, email } = res.data;
                setForm({ ...form, username, email, password: '', file: null });
            } catch (err) {
                console.error("Failed to load profile", err);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "file") {
            setForm({ ...form, file: files[0] });
            setPreview(URL.createObjectURL(files[0]));
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");

        const formData = new FormData();
        formData.append("username", form.username);
        formData.append("email", form.email);
        if (form.password) formData.append("password", form.password);
        if (form.file) formData.append("profileAdmin", form.file);

        try {
            await axios.patch(`${BASE_URL}/updateUser`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Data profil berhasil diperbarui'
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: err.response?.data?.message || 'Terjadi kesalahan'
            });
        }
    };

    return (
        <section className="section">
            <div className="container">
                <h1 className="title">Profil Admin</h1>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="field">
                        <label className="label">Username</label>
                        <div className="control">
                            <input className="input" name="username" value={form.username} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Email</label>
                        <div className="control">
                            <input className="input" type="email" name="email" value={form.email} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Password Baru</label>
                        <div className="control">
                            <input className="input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Kosongkan jika tidak ingin mengubah" />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Foto Profil</label>
                        <div className="control">
                            <input className="input" type="file" name="profileAdmin" accept="image/*" onChange={handleChange} />
                        </div>
                    </div>

                    {preview && (
                        <figure className="image is-128x128 mt-2">
                            <img src={preview} alt="Preview" />
                        </figure>
                    )}

                    <div className="field mt-4">
                        <button type="submit" className="button is-primary">Perbarui</button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ProfileAdmin;
