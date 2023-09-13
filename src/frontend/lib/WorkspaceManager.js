export default function WorkspaceManager( __ ){

  __.setState({
    layouts: [],

    showSearch: false,
    showFeatures: false,
    showExplorer: false,
    showSettings: false,
    showPublisher: false,
    showResetProject: false,
    showDeleteProject: false,
  })

  this.toggle = {
    feature: args => __.setState('showFeatures', args ),
    search: args => __.setState('showSearch', args ),
    settings: type => __.setState('showSettings', type ),
    publish: status => __.setState('showPublisher', status ),
    console: status => __.sm.set('activeConsole', status ),
    explorer: ( status, fn ) => __.setState('showExplorer', status ? { fn } : false )
  }

  this.layouts = {
    change: blocks => __.setStateDirty('layouts', blocks )
  }

  this.select = {
    menu: name => {
      __.setState('activeSection', name )
      __.pstore.set('activeSection', name )
    },
    feature: type => {
      switch( type ) {
        case 'plugin':
        case 'component': this.toggle.search({ filters: { targets: [ type ] } }); break
        case 'dependency': this.toggle.search({ filters: { targets: ['package', 'library'] } }); break
        case 'share': this.toggle.settings('share'); break
        case 'publish': this.toggle.publish( true ); break
      }

      this.toggle.feature( false )
    }
  }

  this.monitor = {
    cursorPosition: position => __.setState('editorCursorPosition', position )
  }
}