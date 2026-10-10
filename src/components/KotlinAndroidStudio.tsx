import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Code,
  Download,
  Copy,
  Check,
  Smartphone,
  Folder,
  FileCode,
  Layers,
  Sparkles,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { KOTLIN_ANDROID_FILES } from '../data/kotlinAndroidCode';
import { KotlinAndroidFile } from '../types';

interface KotlinAndroidStudioProps {
  onClose?: () => void;
}

export const KotlinAndroidStudio: React.FC<KotlinAndroidStudioProps> = ({ onClose }) => {
  const [selectedFileId, setSelectedFileId] = useState<string>('main_activity');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const selectedFile =
    KOTLIN_ANDROID_FILES.find((f) => f.id === selectedFileId) || KOTLIN_ANDROID_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadProjectZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Root project files
      zip.file(
        'settings.gradle.kts',
        `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "NeuroAdapt"
include(":app")
`
      );

      zip.file(
        'build.gradle.kts',
        `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.compose.compiler) apply false
}
`
      );

      zip.file(
        'README.md',
        `# NeuroAdapt for Android (Kotlin & Jetpack Compose)

A Hyper-Personalized Educational Companion tailored for Neurodivergent Learners (ADHD, Dyslexia).

## Features:
- **Jetpack Compose Material 3 UI** with adaptive color tint overlays for Dyslexia (Amber, Peach, Sage, Cyan).
- **OpenDyslexic & Lexend Typography** + Bionic Reading AnnotatedString transformer.
- **Hardware Sensor Monitoring**: Uses Android Accelerometer to detect motor fidget tremors and touch dwell velocity.
- **Dynamic Modality Adaptation**: Real-time switching between Audio, Visual, and Interactive challenges based on cognitive engagement signals.
- **Audio Soundscapes**: Procedural brown noise and text-to-speech narration.

## Quick Start:
1. Open this folder in **Android Studio Ladybug (2024.2+)** or newer.
2. Sync Gradle files.
3. Run on a physical Android device or emulator with API 26+ (Android 8.0+).
`
      );

      // Add all Kotlin & Android source files
      KOTLIN_ANDROID_FILES.forEach((file) => {
        zip.file(file.relativePath, file.code);
      });

      // Generate zip and trigger browser download
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'NeuroAdapt-Kotlin-Android-Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error bundling Android project:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const filteredFiles = KOTLIN_ANDROID_FILES.filter((f) => {
    if (categoryFilter === 'all') return true;
    return f.category === categoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Studio Banner */}
      <div className="rounded-2xl border border-indigo-200 bg-linear-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> Kotlin + Jetpack Compose
              </span>
              <span className="text-xs text-indigo-200 font-medium">Android API 26+</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Native Android Kotlin Codebase
            </h2>
            <p className="text-sm text-indigo-200 mt-1 max-w-2xl leading-relaxed">
              Complete, production-ready Android Kotlin source code implementing real-time hardware sensor tracking, OpenDyslexic / Bionic typography, and dynamic modality adaptation with Jetpack Compose.
            </p>
          </div>

          <button
            onClick={handleDownloadProjectZip}
            disabled={isZipping}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isZipping ? 'Bundling .ZIP...' : 'Download Android Studio Project (.zip)'}
          </button>
        </div>
      </div>

      {/* Code Explorer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* File Directory Sidebar */}
        <div className="lg:col-span-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-indigo-600" />
              Project Files
            </h3>
            <span className="text-xs text-neutral-700 font-semibold">
              {KOTLIN_ANDROID_FILES.length} Files
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'ui', label: 'Compose UI' },
              { id: 'viewmodel', label: 'ViewModel' },
              { id: 'sensor', label: 'Sensors' },
              { id: 'config', label: 'Gradle' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  categoryFilter === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Files List */}
          <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredFiles.map((file) => (
              <button
                key={file.id}
                onClick={() => setSelectedFileId(file.id)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                  selectedFileId === file.id
                    ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20'
                    : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/40'
                }`}
              >
                <FileCode
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    selectedFileId === file.id ? 'text-indigo-600' : 'text-neutral-700'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-neutral-900 block truncate">
                    {file.fileName}
                  </span>
                  <span className="text-[11px] text-neutral-700 block truncate">
                    {file.relativePath}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Code Viewer Panel */}
        <div className="lg:col-span-8 rounded-2xl border border-neutral-200 bg-neutral-900 text-neutral-100 shadow-md overflow-hidden flex flex-col">
          {/* Code Viewer Header */}
          <div className="p-3.5 bg-neutral-950/80 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-neutral-300 ml-2">
                {selectedFile.relativePath}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Description Callout */}
          <div className="px-4 py-2 bg-neutral-800/60 border-b border-neutral-800/80 text-xs text-neutral-300">
            💡 {selectedFile.description}
          </div>

          {/* Code Block with JetBrains Mono */}
          <div className="p-4 overflow-x-auto max-h-[500px] font-mono text-xs leading-relaxed text-emerald-300 bg-neutral-900">
            <pre className="select-text whitespace-pre">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
