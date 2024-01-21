import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { Note } from 'src/note';
import { BottomSheetOverviewExampleSheet } from '../home/home.component';
import { TodoServiceService } from '../todo-service.service';
import { User } from 'firebase/auth';
import { computePosition ,flip, shift, offset} from '@floating-ui/dom';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

  @ViewChild('auto') auto: MatAutocomplete | undefined;

  // @ViewChild('login') loginRef!: ElementRef<HTMLAnchorElement>;
  // @ViewChild('tooltipElement', { static: true }) tooltipRef!: ElementRef<HTMLDivElement>;

  // login : HTMLAnchorElement|null = null;
  // tooltip : HTMLDivElement | null = null;

  logged_in = false;
  user : User|null = null

  url_rel = "/home"

  myControl = new FormControl();
  options: Note[] = [];
  filteredOptions: Observable<Note[]>;

  private routerSubscription: Subscription|null = null;

  constructor(private _bottomSheet: MatBottomSheet,
    public noteService: TodoServiceService,
    private router: Router) {
      // router.
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value))
    );
  }
  
  ngOnInit() {

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.url_rel=event.urlAfterRedirects;
      }
    });

    this.noteService.getUserObservable().subscribe(user => {
      // Update the user's email
      this.user = user;
      if(user != null){
        this.logged_in = true;
        this.noteService.getNotes().then( (notes)=>{
          this.options = notes==null? [] : notes;
        });
      }
      else{
        this.logged_in = false;
        this.options = [];
      }
    });

    this.noteService.getNotesObservable().subscribe(notes => {
      // Update the user's notes
      if( notes != null){
        this.options = notes;
      }
      else{
        this.options =[];
      }
    });
    
  }

  ngAfterViewInit() {
    
    // this.login = this.loginRef.nativeElement;
    // this.tooltip = this.tooltipRef.nativeElement;
    // this.updateFixPop()
  }

  ngOnDestroy() {
    if( this.routerSubscription != null){
      this.routerSubscription.unsubscribe();
    }
  }

  // updateFixPop() {
  //   computePosition(this.login!, this.tooltip!, {
  //     placement: 'top',
  //     middleware: [offset(6), flip(), shift({ padding: 5 })],
  //   }).then(({ x, y }) => {
  //     this.tooltip!.style.left = `${x}px`;
  //     this.tooltip!.style.top = `${y}px`;
  //   });
  // }

  openDialog(action: string) {}
   
  // showTooltip() {
  //   this.tooltip!.style.display = 'block';
  //   this.updateFixPop();
  // }
   
  // hideTooltip() {
  //   this.tooltip!.style.display = 'none';
  // }

  filter(value: string): Note[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.title?.toLowerCase().includes(filterValue));
  }

  displayFn(value: string): string {
    return value ? value : '';
  }

  async signOut(){
    await this.noteService.signOut();
    this.router.navigate(["\home"]);
  }

  openBottomSheet(id?: number): void {
    const config: MatBottomSheetConfig = {
      data: { id: id } // Pass the id value using the `data` property
    };

    this._bottomSheet.open(BottomSheetOverviewExampleSheet, config);
  }

  select(id?: number) {
    this.openBottomSheet(id);
    this.myControl.reset();
  }

  handleEnterKey() {
    console.log("handling enter key press");
    if (this.auto != undefined) {
      const options = this.auto.options.toArray();
      if (options.length > 0) {
        this.select(eval(options[0].id[options[0].id.length - 1]));
      }
    }
    else {
      console.log("auto is undefined");
    }
  }

};