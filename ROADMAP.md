# Project Roadmap

## Version 1.0 (Current) ✅

- [x] Core capture and indexing
- [x] Chrome AI integration (all 5 APIs)
- [x] Vector similarity search
- [x] AES-GCM encryption
- [x] Omnibox integration
- [x] Popup UI (Search, Memories, Stats)
- [x] Clean architecture
- [x] Unit tests
- [x] Documentation

## Version 1.1 (Planned)

### Features
- [ ] **Tag Management**: Auto-tag memories by topic
- [ ] **Advanced Filters**: Date range, domain, tags
- [ ] **Export/Import**: Backup memories to JSON
- [ ] **Duplicate Detection**: Merge similar memories
- [ ] **Visit Tracking**: Track revisits to pages

### Technical
- [ ] **HNSW Index**: Replace linear search with hnswlib-wasm
- [ ] **Incremental Indexing**: Only re-embed changed content
- [ ] **Background Sync**: Sync settings across devices
- [ ] **Performance Metrics**: Track AI API response times

## Version 1.2 (Future)

### Features
- [ ] **Clustering**: Auto-organize memories into topics
- [ ] **Timeline View**: Chronological memory browser
- [ ] **Graph View**: Visualize memory connections
- [ ] **Smart Suggestions**: Proactive memory surfacing
- [ ] **Multi-language**: Full i18n support

### Technical
- [ ] **Web Workers**: Offload vector search
- [ ] **Lazy Loading**: Paginate memory list
- [ ] **Cache Strategy**: Optimize frequent queries
- [ ] **Compression**: Reduce storage footprint

## Version 2.0 (Vision)

### Features
- [ ] **Collections**: Organize memories into folders
- [ ] **Collaboration**: Share collections (optional cloud)
- [ ] **Browser Sync**: Chrome sync integration
- [ ] **Mobile Extension**: Android support
- [ ] **Voice Search**: Speak queries

### Technical
- [ ] **Hybrid Search**: Combine semantic + keyword
- [ ] **Relevance Feedback**: Learn from user interactions
- [ ] **A/B Testing**: Optimize summarization length
- [ ] **Streaming Responses**: Progressive answer rendering

## Research Ideas

- [ ] Experiment with different embedding strategies
- [ ] Benchmark various similarity metrics
- [ ] Evaluate summarization quality
- [ ] Study optimal memory retention strategies
- [ ] Analyze query patterns for UX improvements

## Community Contributions Welcome

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Priority areas for contributors:
- 🎨 UI/UX improvements
- 🧪 Additional test coverage
- 📝 Documentation enhancements
- 🌍 Internationalization
- 🔧 Performance optimization

---

Last updated: October 17, 2025
