import { GlossaryTerm } from '../types';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'term-1',
    termArabic: 'البلاغة',
    termBangla: 'বালাগাত (অলংকার শাস্ত্র)',
    termEnglish: 'Balaghat (Elegance & Eloquence in Rhetoric)',
    category: 'arabic_grammar',
    definitionBangla: 'যে শাস্ত্র দ্বারা অবস্থা ও শ্রোতার মনস্তত্ত্ব অনুযায়ী যথাযথ, বিশুদ্ধ ও প্রাঞ্জল ভাষায় কথা বলার নিয়ম জানা যায়। এর ৩টি শাখা: ইলমুল মাআনী, ইলমুল বায়ান, ইলমুল বাদী।',
    exampleSentence: 'علم البلاغة يشتمل على المعاني والبيان والبديع.',
    quranicReference: 'সূরা আর-রহমান: ৪ (عَلَّمَهُ الْبَيَانَ - তাকে স্পষ্ট বার্তা ও বর্ণনা শেখানো হয়েছে)'
  },
  {
    id: 'term-2',
    termArabic: 'الحديث المرسل',
    termBangla: 'হাদিসে মুরসাল',
    termEnglish: 'Hadith Mursal (Hurry/Forwarded Transmission)',
    category: 'quran_hadith',
    definitionBangla: 'যে হাদিসের সনদে তাবেঈ সরাসরি রাসূলুল্লাহ (সা.) থেকে রেওয়ায়াত করেন, অর্থাৎ মাঝখান থেকে সাহাবীর নাম বাদ পড়ে যায়।',
    exampleSentence: 'ما رواه التابعي عن النبي صلى الله عليه وسلم مباشرة.',
    quranicReference: 'উসূলে হাদিসের নির্ভরযোগ্য পরিভাষা'
  },
  {
    id: 'term-3',
    termArabic: 'الإجماع',
    termBangla: 'ইজমা (সর্বসম্মত সিদ্ধান্ত)',
    termEnglish: 'Ijma (Consensus of Islamic Jurists)',
    category: 'fiqh_usul',
    definitionBangla: 'রাসূলুল্লাহ (সা.)-এর ওফাতের পর কোনো যুগে উম্মতে মোহাম্মাদীর মুজতাহিদ ফকীহগণের কোনো শরয়ী বিধানের উপর একমত পোষণ করা।',
    exampleSentence: 'الإجماع هو المصدر الثالث من مصادر التشريع.',
    quranicReference: 'সূরা নিসা: ১১৫ (وَيَتَّبِعْ غَيْرَ سَبِيلِ الْمُؤْمِنِينَ)'
  },
  {
    id: 'term-4',
    termArabic: 'العصبة',
    termBangla: 'আসাবা (অবশিষ্ট সম্পত্তি প্রাপক)',
    termEnglish: 'Asabah (Residuary Heirs in Islamic Inheritance)',
    category: 'fiqh_usul',
    definitionBangla: 'ইসলামী ফরায়েজ শাস্ত্রে যে সকল ওয়ারিশ জবুল ফুরূজ বা সুনির্দিষ্ট অংশীদারদের অংশ দেয়ার পর অবশিষ্টাংশ সম্পত্তির একক মালিক হয়।',
    exampleSentence: 'الأب والابن والأخ من أصحاب العصبات.',
    quranicReference: 'হাদিস: أَلْحِقُوا الْفَرَائِضَ بِأَهْلِهَا فَمَا بَقِيَ فَهُوَ لِلأَوْلَى رَجُلٍ ذَكَرٍ'
  },
  {
    id: 'term-5',
    termArabic: 'المعرب والمبني',
    termBangla: 'মুআরাব ও মাবনী',
    termEnglish: "Mu'rab (Declinable) & Mabni (Indeclinable)",
    category: 'arabic_grammar',
    definitionBangla: "মুআরাব হলো যে শব্দের শেষ অক্ষরের এরাব বা হরকত বাক্যে আমিলের পরিবর্তনের কারণে পরিবর্তিত হয়। মাবনী হলো যে শব্দের শেষ অক্ষরের এরাব সর্বাবস্থায় অপরিবর্তিত থাকে।",
    exampleSentence: 'الاسم المعرب يتغير آخره باختلاف العوامل، والمبني يلزم حالة واحدة.',
    quranicReference: 'নাহু শাস্ত্রের মৌলিক নিয়ম'
  }
];
