import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Search, Sparkles } from 'lucide-react'

export default function SearchSection() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [gender, setGender] = useState('female')
  const [ageRange, setAgeRange] = useState('22-35')
  const [district, setDistrict] = useState('')
  const [religion, setReligion] = useState('')
  const [education, setEducation] = useState('')
  const [profession, setProfession] = useState('')
  const [civilStatus, setCivilStatus] = useState('Never Married')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (gender) params.set('gender', gender)
    if (ageRange) {
      const [min, max] = ageRange.split('-')
      if (min) params.set('minAge', min)
      if (max) params.set('maxAge', max)
    }
    if (district) params.set('district', district)
    if (religion) params.set('religion', religion)
    if (education) params.set('education', education)
    if (profession) params.set('profession', profession)
    if (civilStatus) params.set('civilStatus', civilStatus)

    navigate(`/search?${params.toString()}`)
  }

  const districts = [
    'Colombo',
    'Gampaha',
    'Kalutara',
    'Kandy',
    'Matale',
    'Nuwara Eliya',
    'Galle',
    'Matara',
    'Hambantota',
    'Jaffna',
    'Kurunegala',
    'Puttalam',
    'Anuradhapura',
    'Polonnaruwa',
    'Badulla',
    'Monaragala',
    'Ratnapura',
    'Kegalle',
  ]

  const religions = ['Buddhist', 'Hindu', 'Christian', 'Roman Catholic', 'Islam', 'Other']
  const educations = [
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate / PhD",
    "Diploma",
    "Professional Qualification",
    "Advanced Level (A/L)",
    "Ordinary Level (O/L)",
    "Other",
  ]
  const professions = [
    'Software & IT',
    'Engineer',
    'Doctor / Medical',
    'Banking & Finance',
    'Teacher / Academic',
    'Business / Entrepreneur',
    'Accountant',
    'Lawyer / Legal',
    'Government Employee',
    'Nurse / Healthcare',
    'Marketing & Sales',
    'Armed Forces / Police',
    'Student',
    'Self-Employed',
    'Other',
  ]

  return (
    <section className="relative -mt-10 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-10 shadow-2xl border border-[#EEE6D8] relative overflow-hidden"
      >
        {/* Subtle decorative gold line on top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4A72C] via-[#F3D77A] to-[#D4A72C]" />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF7F0] border border-[#D4A72C]/30 text-xs font-semibold text-[#996F16] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A72C]" />
            <span>Find Someone Special</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#241A17] tracking-tight">
            {t('home.searchSection.title')}
          </h2>
          <p className="text-sm sm:text-base text-[#241A17]/70 mt-2">
            {t('home.searchSection.subtitle')}
          </p>
        </div>

        {/* Filter Form */}
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Looking For (Gender) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#241A17]/70">
                {t('home.searchSection.lookingFor')}
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#FAF7F0] p-1.5 rounded-2xl border border-[#EEE6D8]">
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    gender === 'female'
                      ? 'bg-[#241A17] text-[#F3D77A] shadow-sm'
                      : 'text-[#241A17]/70 hover:text-[#241A17]'
                  }`}
                >
                  {t('home.searchSection.bride')}
                </button>
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    gender === 'male'
                      ? 'bg-[#241A17] text-[#F3D77A] shadow-sm'
                      : 'text-[#241A17]/70 hover:text-[#241A17]'
                  }`}
                >
                  {t('home.searchSection.groom')}
                </button>
              </div>
            </div>

            {/* Age Range */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#241A17]/70">
                {t('home.searchSection.ageRange')}
              </label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-[#FAF7F0] border border-[#EEE6D8] text-sm text-[#241A17] font-medium focus:outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20 transition-all"
              >
                <option value="18-25">18 – 25 Years</option>
                <option value="22-30">22 – 30 Years</option>
                <option value="25-35">25 – 35 Years</option>
                <option value="30-40">30 – 40 Years</option>
                <option value="35-50">35 – 50 Years</option>
                <option value="45-70">45+ Years</option>
              </select>
            </div>

            {/* District */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#241A17]/70">
                {t('home.searchSection.district')}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-[#FAF7F0] border border-[#EEE6D8] text-sm text-[#241A17] font-medium focus:outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20 transition-all"
              >
                <option value="">All Districts in Sri Lanka</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Religion */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#241A17]/70">
                {t('home.searchSection.religion')}
              </label>
              <select
                value={religion}
                onChange={(e) => setReligion(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-[#FAF7F0] border border-[#EEE6D8] text-sm text-[#241A17] font-medium focus:outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20 transition-all"
              >
                <option value="">All Religions</option>
                {religions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Education */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#241A17]/70">
                {t('home.searchSection.education')}
              </label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-[#FAF7F0] border border-[#EEE6D8] text-sm text-[#241A17] font-medium focus:outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20 transition-all"
              >
                <option value="">Any Education Level</option>
                {educations.map((ed) => (
                  <option key={ed} value={ed}>
                    {ed}
                  </option>
                ))}
              </select>
            </div>

            {/* Profession */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#241A17]/70">
                {t('home.searchSection.profession')}
              </label>
              <select
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-[#FAF7F0] border border-[#EEE6D8] text-sm text-[#241A17] font-medium focus:outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20 transition-all"
              >
                <option value="">Any Profession</option>
                {professions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Marital Status */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#241A17]/70">
                {t('home.searchSection.maritalStatus')}
              </label>
              <select
                value={civilStatus}
                onChange={(e) => setCivilStatus(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl bg-[#FAF7F0] border border-[#EEE6D8] text-sm text-[#241A17] font-medium focus:outline-none focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20 transition-all"
              >
                <option value="">Any Marital Status</option>
                <option value="Never Married">Never Married (Unmarried)</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
                <option value="Separated">Separated</option>
              </select>
            </div>

            {/* Search Action Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="btn-gold w-full h-11 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-gold hover:shadow-gold-lg"
              >
                <Search className="w-4 h-4" />
                {t('home.searchSection.searchBtn')}
              </button>
            </div>

          </div>
        </form>
      </motion.div>
    </section>
  )
}
